import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import { uid } from "uid";
import { app } from "../config";
import { set, ref, getDatabase } from "firebase/database";

const db = getDatabase(app);

const ProcessingPage = () => {
  const [count, setCount] = useState(0);
  const [ratioDataTesting, setRatioDataTesting] = useState(30);
  const [ratioDataTraining, setRatioDataTraining] = useState("70");
  const [resultProcess, setResultProcess] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  const [datapros, setDataPros] = useState([]);
  const [dataReqPros, setDataReqPros] = useState([]);
  const [tableRowsPros, setTableRowsPros] = useState([]);
  const [parsedDataPros, setParsedDataPros] = useState([]);
  const [countDataTesting, setCountDataTesting] = useState(0);
  const [countDataTraining, setCountDataTraining] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [precision, setPrecision] = useState(0);
  const [recall, setRecall] = useState(0);
  const [total_data, setTotalData] = useState(0);
  const [tweet, setDatatweet] = useState(0);
  const [testSamples, setTestSamples] = useState(0);
  const [trainSamples, setTrainSamples] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [testingData, setTestingData] = useState([]);

  const [currentPagePros, setCurrentPagePros] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [totalPages2, setTotalPages2] = useState(1);
  const [itemsPerPage] = useState(10);
  const [itemsPerPage2] = useState(10);

  const [error, setError] = useState(false);

  const addData = (data) => {
    const uuid = uid();
    const newData = {
      accuracy: data.accuracy,
      confusion_matrix: data.confusion_matrix,
      precision: data.precision,
      predictions: data.predictions,
      recall: data.recall,
    };

    set(ref(db, `data/${uuid}`), {
      data: newData,
      uuid: uuid,
    })
      .then(() => {
        console.log("Data added successfully to the database.");
      })
      .catch((error) => {
        console.error("Error adding data to the database:", error);
      });
  };

  const ratio = () => {
    switch (ratioDataTraining) {
      case "70":
        setRatioDataTesting(30);
        break;
      case "80":
        setRatioDataTesting(20);
        break;
      case "90":
        setRatioDataTesting(10);
        break;
      default:
        console.log("error");
    }
  };

  const calculateRatio = () => {
    const dataLength = count;

    switch (ratioDataTraining) {
      case "70":
        setCountDataTraining(Math.ceil((dataLength / 10) * 7));
        setCountDataTesting(Math.ceil((dataLength / 10) * 3));
        break;
      case "80":
        setCountDataTraining(Math.ceil((dataLength / 10) * 8));
        setCountDataTesting(Math.ceil((dataLength / 10) * 2));
        break;
      case "90":
        setCountDataTraining(Math.ceil((dataLength / 10) * 9));
        setCountDataTesting(Math.ceil(dataLength / 10));
        break;
      default:
        console.log("error");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        const rowsArray = [];
        const valuesArray = [];
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });
        setParsedDataPros(results.data);
        setTableRowsPros(rowsArray[0]);
        setDataPros(valuesArray);
        setCount(valuesArray.length);
        setDataReqPros(results.data);
        console.log(results.data);
      },
    });
  };

  const handleProcessing = async () => {
    if (datapros.length - count === -1) {
      alert("Error: Unused data cannot be smaller than 0");
      setError(true);
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:5000/processing", {
        data: dataReqPros.slice(0, count),
        ratio: ratioDataTesting / 100,
        random_state: count,
      });
      console.log(response.data);

      setAccuracy(response.data.accuracy);
      setTestSamples(response.data.num_test_samples);
      setTrainSamples(response.data.num_train_samples);
      setPrecision(response.data.precision);
      setTableData(response.data.predictions);
      setRecall(response.data.recall);
      setTotalData(response.data.total_data);
      setTestingData(response.data.training);

      setCurrentPagePros(1);

      setFormSubmitted(true);
      console.log(response.data.predictions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    ratio();
    calculateRatio();
  }, [count, ratioDataTraining]);

  useEffect(() => {
    const totalPagesCount2 = Math.ceil(testingData.length / itemsPerPage2);
    setTotalPages2(totalPagesCount2);
  }, [testingData, itemsPerPage2]);

  useEffect(() => {
    const totalPagesCount = Math.ceil(tableData.length / itemsPerPage);
    setTotalPages(totalPagesCount);
  }, [tableData, itemsPerPage]);

  const nextPage = () => {
    if (currentPagePros < totalPages) {
      setCurrentPagePros(currentPagePros + 1);
    }
  };

  const nextPage2 = () => {
    if (currentPage2 < totalPages2) {
      setCurrentPage2(currentPage2 + 1);
    }
  };

  const previousPage = () => {
    if (currentPagePros > 1) {
      setCurrentPagePros(currentPagePros - 1);
    }
  };

  const previousPage2 = () => {
    if (currentPage2 > 1) {
      setCurrentPage2(currentPage2 - 1);
    }
  };

  const startIndex1 = (currentPagePros - 1) * itemsPerPage;
  const endIndex1 = startIndex1 + itemsPerPage;

  const startIndex2 = (currentPage2 - 1) * itemsPerPage2;
  const endIndex2 = startIndex2 + itemsPerPage2;

  useEffect(() => {
    setCountDataTraining(countDataTraining);
    setCountDataTesting(countDataTesting);
  }, [countDataTraining, countDataTesting]);

  return (
    <>
      <div>
        <div className="title_page">
          <h1>Processing & Validation </h1>
        </div>
        <div className="page_explain">
          <p>
            In this menu, the data will be divided into training data and test
            data using a ratio of 70:30, 80:20, and 90:10. The purpose of
            validation in this menu is to evaluate and validate the model or
            method used in sentiment analysis. It will display the total amount
            of data used, as well as the percentages of accuracy, precision, and
            recall.
          </p>
        </div>
      </div>

      <div>
        <div class="processing_file">
          <input type="file" onChange={handleFileChange} />
          <span>Total Data : {datapros.length}</span>
        </div>
        <div class="input_processing">
          <div class="text_input_prepros">
            <h3>Enter the amount of data</h3>
            <h3>Ratio of Data Training : Data Testing</h3>
            <h3>Amount of training data and test data</h3>
            <h3>Unused data</h3>
          </div>
          <div className="input_data">
            <div class="">
              <input
                value={count}
                type="number"
                placeholder="Insert Number"
                onChange={(e) => setCount(parseInt(e.target.value))}
              />
            </div>
            <div className="select_hasil_banding">
              <select
                value={ratioDataTraining}
                onChange={(e) => setRatioDataTraining(e.target.value)}
              >
                <option value="70">70</option>
                <option value="80">80</option>
                <option value="90">90</option>
              </select>
              <span>:</span>
              <select
                value={ratioDataTesting}
                onChange={(e) => setRatioDataTesting(parseInt(e.target.value))}
              >
                <option value="30">30</option>
                <option value="20">20</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="select_hasil_banding">
              <span>{`${countDataTraining}  :  ${countDataTesting}`}</span>
            </div>
            {/* Unused Data */}
            <div className="sisa_data">
              <p>{datapros.length - count}</p>{" "}
            </div>
          </div>
          <div class="button_prepos">
            <button onClick={handleProcessing}>Submit</button>
          </div>
        </div>
      </div>

      {/* Data Training */}
      <div class="csv_table">
        <h2>Data Training</h2>
        <div class="full_table">
          <span>Total Data: {testingData.length}</span>
          <table>
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Tweets</th>
                <th scope="col">Emotion</th>
                <th scope="col">Manual Labels</th>
              </tr>
            </thead>
            <tbody>
              {testingData.slice(startIndex2, endIndex2).map((item, number) => (
                <tr key={number + 1}>
                  <td>{startIndex2 + number + 1}</td>
                  <td>{item.Tweet_Text}</td>
                  <td>{item.Emosi}</td>
                  <td>{item.Label}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div class="flexx next_and_prev_btn_container">
            <div>
              <button onClick={previousPage2}>Previous</button>
            </div>
            <div class="total_pages">
              <span>
                {currentPage2}/{totalPages2}
              </span>
            </div>
            <div>
              <button onClick={nextPage2}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Validation */}
      <div class="validation_table_prepos">
        <h2>Table Validation</h2>
        <div class="full_table">
          <table>
            <thead>
              <tr>
                <th scope="col">Total Data</th>
                <th scope="col">Accuracy %</th>
                <th scope="col">Precision %</th>
                <th scope="col">Recall %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{total_data}</td>
                <td>{accuracy}</td>
                <td>{precision}</td>
                <td>{recall}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Data Testing */}
      <div class="csv_table">
        <h2>Data Testing / Uji</h2>
        <div class="full_table">
          <span>Total Data: {tableData.length}</span>
          <table>
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Tweets</th>
                <th scope="col">Emotion</th>
                <th scope="col">Manual Labels</th>
                <th scope="col">Auto labels</th>
              </tr>
            </thead>
            <tbody>
              {tableData.slice(startIndex1, endIndex1).map((item, number) => (
                <tr key={number + 1}>
                  <td>{startIndex1 + number + 1}</td>
                  <td>{item.Tweet_Text}</td>
                  <td>{item.Emosi}</td>
                  <td>{item.Label}</td>
                  <td>{item.Predicted_Label}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div class="flexx next_and_prev_btn_container">
            <div>
              <button onClick={previousPage}>Previous</button>
            </div>
            <div class="total_pages">
              <span>
                {currentPagePros}/{totalPages}
              </span>
            </div>
            <div>
              <button onClick={nextPage}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcessingPage;
