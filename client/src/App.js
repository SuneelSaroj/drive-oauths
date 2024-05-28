import { useState } from "react";
import useDrivePicker from "react-google-drive-picker";
import serverApi from "./api";
// import "./App.css";
import { Table, Button, Container, Row, Col } from "react-bootstrap";

function App() {
  const [openPicker, authResponse] = useDrivePicker();
  const [data, setData] = useState([]);

  const handleOpenPicker = () => {
    openPicker({
      clientId:
        "944473553549-v7pohht4eumi4s5m70b4mjsffv5tc392.apps.googleusercontent.com",
      developerKey: "AIzaSyDA8KmfONDSdW3QYYRJjbtZ9Rh9LSRX12k",
      viewId: "DOCS",
      // token: "your_oauth_token", // replace 'your_oauth_token' with your actual OAuth token if available
      // // The 'DOCS' viewId includes both Google Docs and PDF files by default
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        if (data.action === "picked") {
          // Check if files were picked
          const files = data.docs;
          // Filter files to include only Docs and PDFs
          // const filteredFiles = files.filter(
          //   (file) =>
          //     file.type === "application/pdf" ||
          //     file.type === "application/vnd.google-apps.document"
          // );
          // Send filteredFiles to the backend
          sendFilesToBackend(files);
        } else if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }
      },
    });
  };

  const sendFilesToBackend = (files) => {
    const filesData = files.map((file) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      url: file.url,
    }));

    console.log("updateFile", filesData);
    serverApi
      .post("/updateFile", filesData) // Use .post method to send a POST request

      .then((response) => {
        console.log("response", response);
        if (response.status === 200) {
          console.log("Files sent successfully");
        } else {
          throw new Error(`Failed to send files: ${response.statusText}`);
        }
      })
      .catch((error) => {
        console.error("Error sending files:", error.message);
      });
  };

  const getData = () => {
    serverApi
      .get("/data") // Use .post method to send a POST request
      .then((response) => {
        console.log("response", response.data.data);
        if (response.status === 200) {
          // console.log("response", response);
          setData(response.data.data);
        } else {
          throw new Error(`Failed to send files: ${response.statusText}`);
        }
      })
      .catch((error) => {
        console.error("Error sending files:", error.message);
      });
  };

  return (
    <Container className="mt-1">
      <Row className="justify-content-end">
        <Col className="col-auto">
          <Button variant="primary" onClick={handleOpenPicker}>
            Connect to Drive
          </Button>
        </Col>
        <Col className="col-auto">
          <Button variant="primary" className="ml-2" onClick={getData}>
            View Saved Data
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover variant="dark" className="mt-2">
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.file_id}>
              <td>{item.file_name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default App;
