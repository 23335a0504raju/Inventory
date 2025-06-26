import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";

const Prediction = () => {
  const [month, setMonth] = useState("");
  const [temp, setTemp] = useState("");
  const [humidity, setHumidity] = useState("");
  const [season, setSeason] = useState("");
  const [data, setData] = useState([]);

  const matchMonth = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  };

  const predict = async (e) => {
    e.preventDefault();
    if (!month || !temp || !humidity || !season) {
      alert("Please fill all fields before predicting!");
      return;
    }

    const monthVal = matchMonth[month];

    const response = await fetch("http://localhost:8000/api/predict/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        month: monthVal,
        temp: parseFloat(temp),
        humidity: parseFloat(humidity),
        season: season,
      }),
    });

    if (!response.ok) throw new Error("Failed to predict");
    const result = await response.json();
    setData(result["prediction"]);
    setMonth("");
    setTemp("");
    setHumidity("");
    setSeason("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-lg p-4 w-100" style={{ marginTop:"100px",maxWidth: "450px" }}>
        <h1 className="text-center text-primary mb-4">📊 Predict Demand Conditions</h1>
        
        <div className="row">
          <div className="col-12 mb-3">
            <label className="form-label">Select Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="form-select"
            >
              <option value="">Choose a month</option>
              {Object.keys(matchMonth).map((m) => (
                <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">Temperature (°C)</label>
            <input
              type="number"
              placeholder="Enter temperature"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">Humidity (%)</label>
            <input
              type="number"
              placeholder="Enter humidity"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">Season</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="form-select"
            >
              <option value="">Choose a season</option>
              <option value="rainy">Rainy</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="winter">Winter</option>
            </select>
          </div>
        </div>

        <button onClick={predict} className="btn btn-primary w-100">🔍 Predict</button>

        {data.length > 0 && (
          <div className="mt-4">
            <h2 className="text-center text-success">Prediction Result</h2>
            <table className="table table-striped table-hover mt-3">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Prediction</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prediction;
