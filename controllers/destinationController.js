const Destination = require("../models/Destination");
const stateDistricts = require("../data/stateDistricts.json");
const TripSource = require("../models/TripSource");
const TripQuery = require("../models/TripQuery");

const generateShortName = (name) => {
  return name
    .split(/\s+/)
    .map((word) => word[0].toUpperCase())
    .join("");
};

// add destination

const addDestinations = async (req, res) => {
  try {
    const { destinations } = req.body;

    if (!Array.isArray(destinations)) {
      return res.status(400).json({
        success: false,
        message: "Destinations must be an array",
      });
    }

    const created = [];
    const duplicates = [];

    for (const dest of destinations) {
      const { destinationName, shortName, currency = "INR" } = dest;

      if (!destinationName || !shortName) continue;

      // Check for existing destination
      const exists = await Destination.findOne({
        name: destinationName,
      });

      if (exists) {
        duplicates.push(destinationName);
        continue;
      }

      const aliases = stateDistricts[destinationName] || [];

      const newDest = new Destination({
        name: destinationName,
        shortName,
        currency,
        createdBy: req.user._id,
        // aliases,
      });

      const saved = await newDest.save();
      created.push(saved);
    }

    if (duplicates.length > 0) {
      return res.status(409).json({
        success: false,
        message: `The following destinations already exist: ${duplicates.join(
          ", "
        )}`,
        createdData: created,
      });
    }

    res.status(201).json({
      success: true,
      message: "Destinations added successfully",
      data: created,
    });
  } catch (error) {
    console.error("Add Destination Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// get all destination

const GetallDestination = async (req, res) => {
  try {
    const destinations = await Destination.find().populate(
      "createdBy",
      "name email"
    );
    if (!destinations || destinations.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No Destination found",
      });
    }
    return res.status(200).json({
      error: true,
      message: "Destination list",
      data: destinations,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// update destination

const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, shortName, currency } = req.body;

    // Check if destination exists
    const destination = await Destination.findById(id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    const duplicate = await Destination.findOne({
      _id: { $ne: id },
      name,
      shortName,
    });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message:
          "Another destination with the same name and short name already exists",
      });
    }

    // Update fields if provided
    if (name) destination.name = name;
    if (shortName) destination.shortName = shortName;
    if (currency) destination.currency = currency;

    if (name) {
      const aliases = stateDistricts[name] || [];
      destination.aliases = aliases;
    }

    const updated = await destination.save();

    res.status(200).json({
      success: true,
      message: "Destination updated",
      data: updated,
    });
  } catch (error) {
    console.error("Update Destination Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ----------------------------------------------------trip source section start----------------

// create trip course

const CreateTripSourse = async (req, res) => {
  try {
    const {
      type = "B2B",
      companyName,
      shortName,
      tripTags,
      contactName,
      contactEmail,
      phoneNumbers,
      city,
      state,
      country,
      pinCode,
      street,
      area,
      landmark,
      billingName,
      billingDetails,
    } = req.body;

    // Validate required fields for both types
    if (!companyName || companyName.length < 2) {
      return res
        .status(400)
        .json({
          message:
            "Company Name is required and must be at least 2 characters.",
        });
    }
    if (!shortName || shortName.length < 2) {
      return res
        .status(400)
        .json({
          message: "Short Name is required and must be at least 2 characters.",
        });
    }

    // Create data object
    const sourceData = {
      type,
      companyName,
      shortName,
    };

    if (type === "B2B") {
      Object.assign(sourceData, {
        tripTags,
        contactName,
        contactEmail,
        phoneNumbers,
        city,
        state,
        country,
        pinCode,
        street,
        area,
        landmark,
        billingName,
        billingDetails,
      });
    }

    const tripsource = new TripSource(sourceData);
    await tripsource.save();

    res.status(201).json({
      success: true,
      message: "Trip Source saved successfully",
      data: tripsource,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// get trip source

const GetTripSource = async (req, res) => {
  try {
    const sourcelist = await TripSource.find().sort({ createdAt: -1 });
    if (!sourcelist) {
      return res.status(404).json({
        success: false,
        message: "No trip source found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sourse List",
      data: sourcelist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// update the trip source

const UpdateTripSource = async (req, res) => {
  try {
    const sourceId = req.params.id;
    const {
      type,
      companyName,
      shortName,
      tripTags,
      contactName,
      contactEmail,
      phoneNumbers,
      city,
      state,
      country,
      pinCode,
      street,
      area,
      landmark,
      billingName,
      billingDetails,
    } = req.body;
    if (
      !companyName ||
      companyName.length < 2 ||
      !shortName ||
      shortName.length < 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          "companyName and shortName are required with minimum length of 2",
      });
    }

    let updateData = {
      companyName,
      shortName,
    };

    if (type === "B2B") {
      updateData = {
        ...updateData,
        tripTags,
        contactName,
        contactEmail,
        phoneNumbers,
        city,
        state,
        country,
        pinCode,
        street,
        area,
        landmark,
        billingName,
        billingDetails,
      };
    }

    const updatedAgency = await TripSource.findByIdAndUpdate(
      sourceId,
      updateData,
      { new: true }
    );

    if (!updatedAgency) {
      return res.status(404).json({
        success: false,
        message: "Agency not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Agency updated successfully",
      data: updatedAgency,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// delete source

const DeleteTripSource = async (req, res) => {
  try {
    const { sourceId } = req.params.id;

    if (!sourceId) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong || Sourceid Missing",
      });
    }

    const delsource = await TripSource.findByIdAndDelete(sourceId);
    if (!delsource) {
      return res.status(404).json({
        success: false,
        message: "Trip Source not deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trip Source deleted Successfully",
      data: delsource,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// -------------------------------------new trip query section -------------------------

// add new query

const AddNewQuery = async (req, res) => {
  try {
    const {
      querySource,
      referenceId,
      destination,
      startDate,
      numberOfNights,
      noOfAdults,
      childrenAges,
      guestName,
      phoneNumbers,
      email,
      address,
      comments,
      status,
      salesTeam, // ✅ Use correct variable
    } = req.body;

    // Generate queryId
    const last = await TripQuery.findOne().sort({ createdAt: -1 });
    const nextId = last ? Number(last.queryId.replace("QUERY", "")) + 1 : 1;
    const queryId = `QUERY${String(nextId).padStart(3, "0")}`;

    const tripQuery = new TripQuery({
      queryId,
      querySource,
      referenceId,
      destination,
      startDate,
      numberOfNights,
      duration: `${numberOfNights} Nights, ${numberOfNights + 1} Days`,
      noOfAdults,
      childrenAges,
      guestName,
      phoneNumbers,
      email,
      address,
      comments,
      createdBy: req.user._id,
      salesTeam, // ✅ Use correct field here
      status: status || "New",
    });

    const saved = await tripQuery.save();

    res.status(201).json({
      success: true,
      message: "Trip Query created successfully",
      data: saved,
    });
  } catch (error) {
    console.error("AddNewQuery Error:", error); // ✅ Log error for debug
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message, // optional: include error message
    });
  }
};

// get all trips query

const GetalltripQuery = async (req, res) => {
  try {
    const queries = await TripQuery.find()
      .populate("destination") // populates destination object
      .populate("querySource") // populates querySource object
      .populate("createdBy", "name email") // populates name & email of creator
      .populate("salesTeam", "name email"); // populate sales team members

    res.status(200).json({
      success: true,
      data: queries,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};


// Get a single trip query by its ID
const GetSingleQuery = async (req, res) => {
  try {
    const query = await TripQuery.findById(req.params.id)
      .populate("destination", "name country")
      .populate("querySource")
      .populate("createdBy", "name email")
      .populate("salesTeam", "name email");

    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }
    
    res.status(200).json(query); // Send the single query object directly

  } catch (error) {
    console.error("GetSingleQuery Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// update query status or anything else

const UpdateQueryDataOrStatus = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Missing query _Id",
      });
    }

    // Validate if the query exists
    const query = await TripQuery.findById(id);
    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    Object.keys(req.body).forEach((field) => {
      query[field] = req.body[field];
    });

    const updated = await query.save();

    res.status(200).json({
      success: true,
      message: "Query updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// add follow up of any query

const AddfollowUp = async (req, res) => {
    const { id } = req.params;
    const { message, dueDate, status } = req.body;
  try {
  

    if (!id || !message) {
      return res.status(400).json({
        error: false,
        message: "Something went wrong",
      });
    }

    const query = await TripQuery.findById(id);
    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    query.followUps.push({
      message,
      dueDate,
      createdBy: req.user._id,
      status: status || "Not Solved",
    });

    await query.save();

    res.status(200).json({
      success: true,
      message: "Follow-up added",
      followUps: query.followUps,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// get all follow upes

const GetAllfollowUps = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }

    const query = await TripQuery.findById(id)
      .populate("followUps.createdBy", "name email")
      .select("followUps");

    if (!query) {
      return res
        .status(404)
        .json({ success: false, message: "Query not found" });
    }

    res.status(200).json({
      success: true,
      message: "Follow-ups fetched successfully",
      data: query.followUps,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// update follow ups of any query

const UpdateFolloqUpOfQuery=async(req,res)=>{
  try{

     const { queryId, index } = req.params;
    const { status } = req.body;

    if (!['Solved', 'Not Solved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const query = await TripQuery.findById(queryId);
    if (!query || !query.followUps || !query.followUps[index]) {
      return res.status(404).json({ success: false, message: 'Follow-up not found' });
    }

    query.followUps[index].status = status;

    await query.save();

    res.status(200).json({
      success: true,
      message: 'Follow-up status updated successfully',
      followUp: query.followUps[index]
    });
  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"Internal server error"
    })
  }
}







module.exports = {
  addDestinations,
  GetallDestination,
  updateDestination,
  CreateTripSourse,
  GetTripSource,
  UpdateTripSource,
  DeleteTripSource,
  AddNewQuery,
  GetalltripQuery,
  GetSingleQuery,
  UpdateQueryDataOrStatus,
  GetAllfollowUps,
  AddfollowUp,
  UpdateFolloqUpOfQuery
};
