import React, { useState } from "react";
import TextToken from "../components/TextToken";

const StopwordPage = ({ dataStopword, stemming }) => {
  const totalData = dataStopword.length;

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, dataStopword.length);

  return (
    <>
      <div>
        <div class="title_page">
          <h1>Stopword</h1>
        </div>
        <div class="page_explain">
          <p>
            The purpose of using stopwords in the preprocessing step is to
            remove common words that have little informational value in text
            analysis. Stopwords are common words like "and," "or," "from,"
            "that," which frequently appear in text but have limited
            contribution to content understanding or extraction of important
            features.
          </p>
        </div>
        <button class="pages_inputcsv" onClick={() => stemming()}>
          Stemming
        </button>
      </div>
      <div class="csv_table">
        <span>Total data: {totalData}</span>
        <table>
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Tokenize Result</th>
              <th scope="col">Conversion Results (Stopword)</th>
            </tr>
          </thead>
          <tbody>
            {dataStopword.slice(startIndex, endIndex).map((item, number) => (
              <tr key={number + 1}>
                <td>{startIndex + number + 1}</td>
                <td>
                  [{<TextToken tokenizeText={item.original_stopwords} />}]
                </td>
                <td>[{<TextToken tokenizeText={item.stopwords_text} />}]</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div class="flexx next_and_prev_btn_container">
          <div>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
          </div>
          <div class="total_pages">
            <p>
              {currentPage} / {Math.ceil(dataStopword.length / rowsPerPage)}
            </p>
          </div>
          <div>
            <button
              disabled={endIndex >= dataStopword.length}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StopwordPage;
