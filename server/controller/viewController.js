const db = require("../db/conn").pool;
const asyncHandler = require("../middleware/async");

const getData = asyncHandler(async (req, res, next) => {
  console.log("View getData-> getData");
  try {
    let sql = `select * from files`;

    const data = await db.query(sql);
    // console.log("View Data----->>>>> ", data);
    if (data.rowCount > 0) {
      console.log("View Data----->>>>> ", data.rows);
      return res.status(200).send({ success: true, data: data.rows });
    } else {
      console.log("View Data not found");
      return res
        .status(206)
        .send({ success: false, message: "View data not found" });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(206)
      .json({ success: false, message: "Code: " + e.message });
  }
});

const updateData = asyncHandler(async (req, res, next) => {
  console.log("View updateData-> updateData");
  try {
    // Assuming req.body.data is an array of objects containing data to be inserted
    // const newData = req.body;

    const newData = req.body.map((record) => ({
      file_id: record.id,
      file_name: record.name,
    }));
    console.log("newData----->>>>> ", newData);

    // Check if any data already exists
    const existingData = await db.query("SELECT * FROM files");
    console.log("View Data----->>>>> ", existingData.rows);

    // Filter out existing records from newData
    const filteredData = newData.filter((newRecord) => {
      return !existingData.rows.some(
        (existingRecord) =>
          existingRecord.file_id === newRecord.id &&
          existingRecord.file_name === newRecord.name
      );
    });

    // If no new data to insert, return message
    if (filteredData.length === 0) {
      console.log("No new data to insert");
      return res
        .status(200)
        .send({ success: true, message: "No new data to insert" });
    }

    // Construct the SQL query to insert the new data
    let sql = `INSERT INTO files (file_id, file_name) VALUES `;
    filteredData.forEach((record, index) => {
      sql += `('${record.file_id}', '${record.file_name}')`;
      if (index !== filteredData.length - 1) {
        sql += `, `;
      }
    });

    // Execute the insert query
    console.log("sql:", sql);
    const data = await db.query(sql);
    console.log("Inserted Data:", filteredData);

    return res.status(200).send({
      success: true,
      message: "Data inserted successfully",
      insertedData: filteredData,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error: " + e.message });
  }
});

module.exports = {
  getData,
  updateData,
};
