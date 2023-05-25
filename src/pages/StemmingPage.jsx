import React, { useState } from "react";
import TextToken from "../components/TextToken";

const StemmingPage = ({ dataStemming, slang }) => {
  const totalData = dataStemming.length;

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, dataStemming.length);

  return (
    <>
      <div>
        <div class="title_page">
          <h1>Stemming</h1>
        </div>
        <div class="page_explain">
          <p>
            The purpose of stemming in the preprocessing step is to convert
            words into their base or root form. Stemming is used to reduce words
            to their basic form so that variations of words with the same root
            can be merged into a single entity.
          </p>
        </div>
        <button class="pages_inputcsv" onClick={() => slang()}>
          Slang
        </button>
      </div>
      <div class="csv_table">
        <span>Total data: {totalData}</span>
        <table>
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Stopword Result</th>
              <th scope="col">Conversion Results (Stemming)</th>
            </tr>
          </thead>
          <tbody>
            {dataStemming.slice(startIndex, endIndex).map((item, number) => (
              <tr key={number + 1}>
                <td>{startIndex + number + 1}</td>
                <td>[{<TextToken tokenizeText={item.original_stemming} />}]</td>
                <td>[{<TextToken tokenizeText={item.stemming_text} />}]</td>
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
              {currentPage} / {Math.ceil(dataStemming.length / rowsPerPage)}
            </p>
          </div>
          <div>
            <button
              disabled={endIndex >= dataStemming.length}
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

export default StemmingPage;
