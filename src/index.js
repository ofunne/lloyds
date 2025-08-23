import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

const App = () => {

  const [formData, setFormData] = React.useState(() => {
    const saved = localStorage.getItem("mortgageForm");
    return saved ? JSON.parse(saved) : {};
  });
  const[result, setResult] = useState(null);
  React.useEffect(() => {
    localStorage.setItem("mortgageForm", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  };

  const handleCalculate = () => {
    let totalIncome = 0;

    if (formData.employment === "employed") {
      totalIncome += formData.basicIncome || 0;
    }
    if (formData.employment === "self") {
      totalIncome += ((formData.selfEmp1 || 0) + (formData.selfEmp2 || 0))/2;
    }

    if (formData.participants === "two") {
      if (formData.employment2 === "employed") {
        totalIncome += formData.basicIncome2 || 0;
      }
      if (formData.employment2 === "self") {
        totalIncome += ((formData.selfEmp12 || 0) + (formData.selfEmp22 || 0))/2;
      }
    }

    totalIncome +=
      (formData.bonuses || 0) +
      (formData.commission || 0) +
      (formData.overtime || 0) +
      (formData.otherPayments || 0) +
      (formData.bonuses2 || 0) +
      (formData.commission2 || 0) +
      (formData.overtime2 || 0) +
      (formData.otherPayments2 || 0);

    const maxBorrow = totalIncome * 4.5;

    const propertyPrice = formData.propertyPrice || maxBorrow;
    const deposit = formData.deposit || onabort;
    const loanAmount = Math.max(maxBorrow - deposit, 0);

    const annualRate = formData.interestRate || 5;
    const years = formData.termYears || 25

    const r = annualRate/100/12;
    const n = years * 12;
    const monthly =
      r > 0
        ? loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        : loanAmount / n;

    setResult({
      totalIncome,
      maxBorrow,
      loanAmount,
      monthly: monthly.toFixed(2),
    });
  };

  const handleReset = () => {
    setFormData({});
    localStorage.removeItem("mortgageForm")
  };

  return(
    <div className="container">
      <h2>MORTGAGE CALCULATOR</h2>
      <form>

        <div id="participants">
          <label htmlFor="participants">How many people will be applying for the mortgage? *</label><br/>
          <input 
            type="radio" 
            name="participants"
            value="one"
            checked={formData.participants === "one"}
            onChange={handleChange}
          /> 
          Just me
          <input 
            type="radio" 
            name="participants"
            value="two"
            checked={formData.participants === "two"}
            onChange={handleChange}
          />
          Me and someone else
        </div>

        <div>
          <label>What is the price of the property?</label>
          <input
            type="number"
            name="propertyPrice"
            placeholder="£"
            value={formData.propertyPrice || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>How much is your deposit?</label>
          <input
            type="number"
            name="deposit"
            placeholder="£"
            value={formData.deposit || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>How long is the repayment period?</label>
          <input
            type="number"
            name="termYears"
            placeholder="Default: 25 years"
            value={formData.termYears || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>What is the interest rate?</label>
          <input
            type="number"
            name="interestRate"
            placeholder="Default: 5%"
            value={formData.interestRate || ""}
            onChange={handleChange}
          />
        </div>

        {/* First applicant */}
        <div id="employment">
          <label htmlFor="employment">What is your employment status? *</label>
          <br/>
          <input
            type="radio"
            name="employment"
            value="employed"
            checked={formData.employment === "employed"}
            onChange={handleChange}
          />
          Employed
          <input
            type="radio"
            name="employment"
            value="self"
            checked={formData.employment === "self"}
            onChange={handleChange}
          />
          Self-employed
          <input
            type="radio"
            name="employment"
            value="retired"
            checked={formData.employment === "retired"}
            onChange={handleChange}
          /> Retired
          <input
            type="radio"
            name="employment"
            value="unemployed"
            checked={formData.employment === "unemployed"}
            onChange={handleChange}
          /> Unemployed<br/>
        </div>

        {formData.employment === "employed" && (
          <>
            <div id="basicIncome">
              <label htmlFor="basicIncome">How much do you earn each year, before tax? (If employed)</label><br/>
              <input 
                type="number" 
                placeholder="£" 
                name="basicIncome"
                value={formData.basicIncome || ''}
                onChange={handleChange}
              /><br/>
            </div>

            <div id="bonuses">
              <label htmlFor="bonuses">
                Are you paid any bonuses?
                <br/>
                If so, please tell us your yearly bonus amount before tax.
              </label><br/>
              <input 
                type="number" 
                placeholder="£" 
                name="bonuses"
                value={formData.bonuses || ''}
                onChange={handleChange}
              /> <br/>
            </div>

            <div id="commission">
              <label htmlFor="commission">
                Are you paid any commission?
                <br/>
                If so, please tell us your yearly commission amount before tax.
              </label><br/>
              <input 
                type="number" 
                placeholder="£" 
                name="commission"
                value={formData.commission || ''}
                onChange={handleChange}
              /><br/>
            </div>

            <div id="overtime">
              <label htmlFor="overtime">
                Are you paid overtime?
                <br/>
                If so, please tell us your yearly overtime amount before tax.
                If your overtime isn't always the same, please tell us the average amount received over the year.
              </label><br/>
              <input 
                type="number" 
                placeholder="£" 
                name="overtime"
                value={formData.overtime || ''}
                onChange={handleChange}
              /><br/>
            </div>
          </>
        )}

        {formData.employment === "self" && (
          <div id="selfEmp">
            <label htmlFor="selfEmp1">How much profit did you earn in the last tax year?</label><br/>
            <input 
              type="number" 
              placeholder="£" 
              name="selfEmp1"
              value={formData.selfEmp1 || ""}
              onChange={handleChange}
            /><br/>
            <label htmlFor="selfEmp2">How much profit did you earn in the tax year before last?</label><br/>
            <input 
              type="number" 
              placeholder="£" 
              name="selfEmp2"
              value={formData.selfEmp2 || ""}
              onChange={handleChange}
            /><br/>
          </div>
        )}

        <div id="otherPayments">
          <label htmlFor="otherPayments">
            Are you paid any other money?
            <br/>
            If so, please tell us the total yearly amount of other payments before tax.
            If your payments aren't always the same, please tell us the average amount received over the year.
          </label><br/>
          <input 
            type="number" 
            placeholder="£" 
            name="otherPayments"
            value={formData.otherPayments || ''}
            onChange={handleChange}
          /><br/>
        </div>

        {/* Conditional second applicant */}
        {formData.participants === "two" && (
          <>
            <div id="employment2">
              <label htmlFor="employment2">What is the employment status of the second applicant? *</label>
              <br/>
              <input
                type="radio"
                name="employment2"
                value="employed"
                checked={formData.employment2 === "employed"}
                onChange={handleChange}
              />
              Employed
              <input
                type="radio"
                name="employment2"
                value="self"
                checked={formData.employment2 === "self"}
                onChange={handleChange}
              />
              Self-employed
              <input
                type="radio"
                name="employment2"
                value="retired"
                checked={formData.employment2 === "retired"}
                onChange={handleChange}
              /> Retired
              <input
                type="radio"
                name="employment2"
                value="unemployed"
                checked={formData.employment2 === "unemployed"}
                onChange={handleChange}
              /> Unemployed<br/>
            </div>

            {formData.employment2 === "employed" && (
              <>
                <div id="basicIncome2">
                  <label htmlFor="basicIncome2">How much does the second applicant earn each year, before tax? *</label><br/>
                  <input 
                    type="number"
                    placeholder="£" 
                    name="basicIncome2"
                    value={formData.basicIncome2 || ''}
                    onChange={handleChange}
                  /><br/>
                </div>
                <div id="bonuses2">
                  <label htmlFor="bonuses2">
                    Is the second applicant paid any bonuses?
                    <br/>
                    If so, please tell us their yearly bonus amount before tax.
                  </label><br/>
                  <input 
                    type="number" 
                    placeholder="£" 
                    name="basicIncome"
                    value={formData.bonuses2 || ''}
                    onChange={handleChange}
                  /><br/>
                </div>

                <div id="commission2">
                  <label htmlFor="commission2">
                    Is the second applicant paid any commission?
                    <br/>
                    If so, please tell us their yearly commission amount before tax.
                  </label><br/>
                  <input 
                    type="number" 
                    placeholder="£" 
                    name="basicIncome"
                    value={formData.commission2 || ''}
                    onChange={handleChange}
                  /><br/>
                </div>

                <div id="overtime2">
                  <label htmlFor="overtime2">
                    Is the second applicant paid overtime?
                    <br/>
                    If so, please tell us their yearly overtime amount before tax.
                    If their overtime isn't always the same, please tell us the average amount received over the year.
                  </label><br/>
                  <input 
                    type="number" 
                    placeholder="£" 
                    name="basicIncome"
                    value={formData.overtime2 || ''}
                    onChange={handleChange}
                  /><br/>
                </div>
              </>
            )}

            {formData.employment2 === "self" && (
              <div id="selfEmp2">
                <label htmlFor="selfEmp12">How much profit did the second applicant earn in the last tax year?</label><br/>
                <input 
                  type="number" 
                  placeholder="£" 
                  name="selfEmp12"
                  value={formData.selfEmp12 || ""}
                  onChange={handleChange}
                /><br/>
                <label htmlFor="selfEmp22">How much profit did the second applicant earn in tax year before last?</label><br/>
                <input 
                  type="number" 
                  placeholder="£" 
                  name="selfEmp22"
                  value={formData.selfEmp22 || ""}
                  onChange={handleChange}
                /><br/>
              </div>
            )}

            <div id="otherPayments2">
              <label htmlFor="otherPayments2">
                Is the second applicant paid any other money?
                <br/>
                If so, please tell us the total yearly amount of other payments before tax.
                If their payments aren't always the same, please tell us the average amount received over the year.
              </label><br/>
              <input 
                type="number" 
                placeholder="£" 
                name="otherPayments"
                value={formData.otherPayments2 || ''}
                onChange={handleChange}
              /><br/>
            </div>
          </>
        )}

        <button type="button" onClick={handleCalculate}>Calculate</button><br/>
        <button type="button" onClick={handleReset}>Reset</button>

      </form>

      {result && (
        <div className="results">
          <h3>Your Mortgage Details</h3>
          <p>Your total household income is: <span className="num">£{result.totalIncome.toLocaleString()}</span></p>
          <p>You may be able to borrow up to: <span className="num">£{result.maxBorrow.toLocaleString()}</span></p>
          <p>With your deposit, your loan amount would be: <span className="num">£{result.loanAmount.toLocaleString()}</span></p>
          <p>Your montly repayment for this loan amount would be: <span className="num">£{result.monthly}</span></p>
        </div>  
      )}
    </div>
  );
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);