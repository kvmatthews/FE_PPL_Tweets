import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";
import RemoveCharacter from "./pages/RemoveCharacter";
import CaseFoldingPage from "./pages/CaseFoldingPage";
import TokenizePage from "./pages/TokenizePage";
import StopwordPage from "./pages/StopwordPage";
import StemmingPage from "./pages/StemmingPage";
import RemovePunctuation from "./pages/RemovePunctuation";
import SlangPage from "./pages/Slang";
import ProcessingPage from "./pages/ProcessingPage";
import ResultPreprocessing from "./pages/ResultPreprocessing";
import twitterBlue from "./assets/twitterBlue.svg";
import dataCollection from "./assets/dataCollection.svg";
import preProcessing from "./assets/pre-processing.svg";
import processingsvg from "./assets/processing.svg";
import validationsvg from "./assets/validation.svg";
import Validation from "./pages/ValidationPage";

import { uid } from "uid";
import { app } from "./config";
import { set, ref, getDatabase } from "firebase/database";

const db = getDatabase(app);

const App = () => {
  let currentPage;
  const [page, setPage] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(19);
  const [data, setData] = useState([]);
  const [dataReq, setDataReq] = useState([]);
  const [dataSlang, setDataSlang] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [dataTokens, setDataTokens] = useState([]);
  const [dataResult, setDataResult] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [dataStopword, setDataStopword] = useState([]);
  const [dataStemming, setDataStemming] = useState([]);
  const [dataFiltering, setDataFiltering] = useState([]);
  const [dataCaseFolding, setDataCaseFolding] = useState([]);
  const [dataRemoveCharacter, setDataRemoveCharacter] = useState([]);
  const [dataResultPreprocessing, setDataResultPreprocesing] = useState([]);

  // Processing & Validation
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });
        setParsedData(results.data);
        setTableRows(rowsArray[0]);
        setData(valuesArray);
        setDataReq(results.data);
        console.log(results.data);
      },
    });
  };

  const handlePrepocessing = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/preprocessing", {
        data: dataReq,
      });
      console.log(response.data);
      setDataRemoveCharacter(response.data.remove_emoji);
      setDataCaseFolding(response.data.text_lower_case);
      setDataTokens(response.data.tokens);
      setDataStopword(response.data.stopwords_list);
      setDataStemming(response.data.stemmed_tokens);
      setDataResultPreprocesing(response.data.stemmed_text);
      setDataResult(response.data.final_process);
      setDataFiltering(response.data.remove_character);
      setDataSlang(response.data.slang_remove);

      console.log(response.data.remove_character);
    } catch (error) {
      console.log(error);
    }
  };

  // Processing Logic Validation

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

  const calculate = () => {
    setPage(1);
    handlePrepocessing();
  };

  const removecharcater = () => {
    setPage(2);
  };

  const removepunctuation = () => {
    setPage(3);
  };

  const tokenize = () => {
    setPage(4);
  };

  const stopword = () => {
    setPage(5);
  };

  const stemming = () => {
    setPage(6);
  };

  const slang = () => {
    setPage(7);
  };

  const result = () => {
    setPage(8);
  };

  const processing = () => {
    setPage(9);
  };

  const validation = () => {
    setPage(10);
    // handleValidation();
  };

  useEffect(() => {
    // console.log(dataResult);
  });
  switch (page) {
    case 0:
      currentPage = (
        <>
          <div class="">
            <div class="title_page">
              <h1>Data Collection</h1>
            </div>
            <div class="page_explain">
              <p>
                The purpose of this data collection menu is to display and
                submit data for processing. The collected data includes text or
                messages that have opinions, views, or sentiments from users
                tweets about artificial intelligence.
              </p>
            </div>
            <div class="pages_inputcsv">
              {data.length !== 0 ? (
                <div class="btn_form">
                  <button onClick={() => calculate()}>
                    Submit for Pre-Processing
                  </button>
                  <button onClick={() => setData([])}>Reset</button>
                </div>
              ) : (
                <form>
                  <label>
                    <input type="file" onChange={handleFileUpload} />
                  </label>
                </form>
              )}
            </div>
            <div class="csv_table">
              <h2>Data CSV</h2>
              <div class="full_table">
                <span>total data: {data.length}</span>
                {data.length !== 0 ? (
                  <>
                    <table>
                      <thead>
                        <tr>
                          <th>No</th>
                          <th scope="col">Tweet ID</th>
                          <th scope="col">Username</th>
                          <th scope="col">Created At</th>
                          <th scope="col">Retweet Count</th>
                          <th scope="col">Favorite Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data
                          .slice(startIndex, endIndex + 1)
                          .map((item, index) => (
                            <tr key={startIndex + index + 1}>
                              <td>{startIndex + index + 1}</td>
                              <td>{item[1]}</td>
                              <td>{item[2]}</td>
                              <td>{item[3]}</td>
                              <td>{item[4]}</td>
                              <td>{item[5]}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {data.length !== 0 && (
                      <div class="flexx next_and_prev_btn_container">
                        <div class="">
                          <button
                            disabled={startIndex === 0}
                            onClick={() => {
                              setStartIndex(startIndex - 20);
                              setEndIndex(endIndex - 20);
                            }}
                          >
                            Previous
                          </button>
                        </div>
                        <div class="total_pages">
                          <p>
                            {startIndex / 20 + 1} /{" "}
                            {Math.ceil(data.length / 20)}
                          </p>
                        </div>
                        <div class="next_btn">
                          <button
                            disabled={endIndex >= data.length - 1}
                            onClick={() => {
                              setStartIndex(startIndex + 20);
                              setEndIndex(endIndex + 20);
                            }}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <table>
                      <thead>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                    </table>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      );
      break;
    case 1:
      currentPage = (
        <>
          <div>
            <CaseFoldingPage
              caseFolding={dataCaseFolding}
              removecharcater={removecharcater}
            />
          </div>
        </>
      );
      break;
    case 2:
      currentPage = (
        <>
          <div>
            <RemoveCharacter
              dataRemoveCharacter={dataRemoveCharacter}
              removepunctuation={removepunctuation}
            />
          </div>
        </>
      );
      break;
    case 3:
      currentPage = (
        <>
          <div>
            <RemovePunctuation
              dataFiltering={dataFiltering}
              tokenize={tokenize}
            />
          </div>
        </>
      );
      break;
    case 4:
      currentPage = (
        <>
          <div>
            <TokenizePage dataTokenize={dataTokens} stopword={stopword} />
          </div>
        </>
      );
      break;
    case 5:
      currentPage = (
        <>
          <div>
            <StopwordPage dataStopword={dataStopword} stemming={stemming} />
          </div>
        </>
      );
      break;
    case 6:
      currentPage = (
        <>
          <div>
            <StemmingPage dataStemming={dataStemming} slang={slang} />
          </div>
        </>
      );
      break;
    case 7:
      currentPage = (
        <>
          <div>
            <SlangPage dataSlang={dataSlang} result={result} />
          </div>
        </>
      );
      break;
    case 8:
      currentPage = (
        <>
          <div>
            <ResultPreprocessing
              dataResult={dataResult}
              processing={processing}
            />
          </div>
        </>
      );
      break;
    case 9:
      currentPage = (
        <>
          <div>
            <div className="title_page">
              <h1>Processing</h1>
            </div>
            <div className="page_explain">
              <p>
                In this menu, the data will be divided into training data and
                test data using a ratio of 70:30, 80:20, and 90:10.
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
                    onChange={(e) =>
                      setRatioDataTesting(parseInt(e.target.value))
                    }
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
                  {testingData
                    .slice(startIndex2, endIndex2)
                    .map((item, number) => (
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
        </>
      );
      break;
    case 10:
      currentPage = (
        <>
          {/* Table Validation */}
          <div className="title_page">
            <h1>Validation </h1>
          </div>
          <div className="page_explain">
            <p>
              The purpose of validation in this menu is to evaluate and validate
              the model or method used in sentiment analysis. It will display
              the total amount of data used, as well as the percentages of
              accuracy, precision, and recall.
            </p>
          </div>
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
                  {tableData
                    .slice(startIndex1, endIndex1)
                    .map((item, number) => (
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
      break;
    default:
      currentPage = (
        <div>
          <h1>Halaman tidak ditemukan</h1>
        </div>
      );
      break;
  }
  return (
    <>
      <div class="main_content">
        <nav>
          <div onClick={() => setPage(0)} class="nav_logo">
            <img alt="" src={twitterBlue} class="logo_tweet" />
            <h1>Anset</h1>
          </div>
          <ul>
            <li class="sidebar_menu">
              <a onClick={() => setPage(0)}>
                <div class="home_page">
                  <span>
                    <div class="flexx">
                      <img alt="" src={dataCollection} class="page_nav_logo" />
                      <p>Data Collection</p>{" "}
                    </div>
                  </span>
                </div>
              </a>
            </li>

            <li class="sidebar_menu flexx">
              <a onClick={() => setPage(8)}>
                <div class="home_page">
                  <span>
                    <div class="flexx">
                      <img alt="" src={preProcessing} class="page_nav_logo" />
                      <p>Pre-processing</p>{" "}
                    </div>
                  </span>
                </div>
              </a>
            </li>

            {/* sub_menu */}
            <div>
              <ul>
                <li class="sub_menu">
                  <a onClick={() => setPage(1)}>
                    <span>
                      <p>Case Folding</p>{" "}
                    </span>
                  </a>
                </li>
                <li class="sub_menu">
                  <a onClick={() => setPage(2)}>
                    <span>
                      <p>Remove Emoji</p>{" "}
                    </span>
                  </a>
                </li>
                <li class="sub_menu">
                  <a onClick={() => setPage(3)}>
                    <span>
                      <p>Remove Punctuation</p>{" "}
                    </span>
                  </a>
                </li>
                <li class="sub_menu">
                  <a onClick={() => setPage(4)}>
                    <span>
                      <p>Tokenization</p>{" "}
                    </span>
                  </a>
                </li>
                <li class="sub_menu">
                  <a onClick={() => setPage(5)}>
                    <span>
                      <p>Stopword</p>{" "}
                    </span>
                  </a>
                </li>
                <li class="sub_menu">
                  <a onClick={() => setPage(6)}>
                    <span>
                      <p>Stemming</p>{" "}
                    </span>
                  </a>
                </li>
                <li class="sub_menu">
                  <a onClick={() => setPage(7)}>
                    <span>
                      <p>Remove Slang</p>{" "}
                    </span>
                  </a>
                </li>
                <li class="sub_menu">
                  <a onClick={() => setPage(8)}>
                    <span>
                      <p>Result</p>{" "}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            {/* akhir sub_menu */}

            <li class="sidebar_menu">
              <a onClick={() => setPage(9)}>
                <div class="home_page">
                  <span>
                    <div class="flexx">
                      <img alt="" src={processingsvg} class="page_nav_logo" />
                      <p>Processing</p>{" "}
                    </div>
                  </span>
                </div>
              </a>
            </li>
            <li class="sidebar_menu">
              <a onClick={() => validation()}>
                <div class="home_page">
                  <span>
                    <div class="flexx">
                      <img alt="" src={validationsvg} class="page_nav_logo" />
                      <p>Validation</p>{" "}
                    </div>
                  </span>
                </div>
              </a>
            </li>
          </ul>
        </nav>
        <div class="main_content_data_collection">{currentPage}</div>
      </div>
    </>
  );
};

export default App;
