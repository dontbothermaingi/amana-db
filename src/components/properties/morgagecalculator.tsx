import { Slider, Typography } from "@mui/material";
import { useState } from "react";

function MortgageCalculator({ totalPrice }: any) {
  const [downPayment, setDownPayment] = useState(40);
  const [loanPeriod, setLoanPeriod] = useState(20);
  const [interestRate, setInterestRate] = useState(4.19);
  const [totalPricee, setTotalPricee] = useState(1200000);

  const formatter = new Intl.NumberFormat();

  const calculateDownPayment = (value: any, price: any) =>
    (price * value) / 100;

  // Use prop totalPrice if passed, otherwise fallback to local state
  const price = parseFloat(totalPrice) > 0 ? totalPrice : totalPricee;

  const loanAmount = price - calculateDownPayment(downPayment, price);

  // Monthly mortgage calculation
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanPeriod * 12;

  const monthlyPayment =
    monthlyInterestRate === 0
      ? loanAmount / numberOfPayments
      : (loanAmount *
          (monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto">
      <Typography
        fontFamily={"IT Medium"}
        fontSize={{ lg: "30px", md: "30px", xs: "30px" }}
        align="center"
      >
        Mortgage Calculator
      </Typography>

      <hr />

      {/* Monthly Payment */}
      <div>
        <Typography fontFamily={"IT Medium"}>
          Estimated Monthly Payment
        </Typography>
        <Typography fontFamily={"IT Medium"} variant="h4" color="#BA7F55">
          AED {formatter.format(Math.round(monthlyPayment))}
        </Typography>
      </div>

      {/* Total Price */}
      <div className="rounded-md shadow-sm border">
        <div className="px-5 py-3">
          <Typography fontFamily={"IT Medium"} gutterBottom>
            Total Price
          </Typography>
          <div className="flex justify-between items-center">
            <Typography>{formatter.format(price)}</Typography>
            <Typography>{100}%</Typography>
          </div>
          {/* Only show slider if no prop is passed */}
          {totalPrice <= 0 && (
            <Slider
              value={totalPricee}
              onChange={(e, value) => setTotalPricee(value)}
              max={30000000}
              min={230500}
              style={{ color: "#BA7F55" }}
            />
          )}
        </div>
      </div>

      {/* Down Payment */}
      <div className="rounded-md shadow-sm border">
        <div className="px-5 py-3">
          <Typography fontFamily={"IT Medium"} gutterBottom>
            Down Payment
          </Typography>
          <div className="flex justify-between items-center">
            <Typography>
              {formatter.format(calculateDownPayment(downPayment, price))}
            </Typography>
            <Typography>{downPayment}%</Typography>
          </div>
          <Slider
            value={downPayment}
            onChange={(e, value) => setDownPayment(value)}
            max={80}
            min={20}
            style={{ color: "#BA7F55" }}
          />
        </div>
      </div>

      {/* Loan Amount */}
      <div className="rounded-md shadow-sm border">
        <div className="px-5 py-3">
          <Typography fontFamily={"IT Medium"} gutterBottom>
            Loan Amount
          </Typography>
          <div className="flex justify-between items-center">
            <Typography>{formatter.format(loanAmount)}</Typography>
            <Typography>{100 - downPayment}%</Typography>
          </div>
        </div>
      </div>

      {/* Loan Period */}
      <div className="rounded-md shadow-sm border">
        <div className="px-5 py-3">
          <Typography fontFamily={"IT Medium"} gutterBottom>
            Loan Period
          </Typography>
          <div className="flex justify-between items-center mb-2">
            <Typography>{loanPeriod} years</Typography>
          </div>
          <Slider
            value={loanPeriod}
            onChange={(e, value) => setLoanPeriod(value)}
            max={25}
            min={1}
            style={{ color: "#BA7F55" }}
          />
        </div>
      </div>

      {/* Interest Rate */}
      <div className="rounded-md shadow-sm border">
        <div className="px-5 py-3">
          <Typography fontFamily={"IT Medium"} gutterBottom>
            Interest Rate
          </Typography>
          <div className="flex justify-between items-center mb-2">
            <Typography>{interestRate}%</Typography>
          </div>
          <Slider
            value={interestRate}
            onChange={(e, value) => setInterestRate(value)}
            max={10}
            min={1}
            step={0.01}
            style={{ color: "#BA7F55" }}
          />
        </div>
      </div>
    </div>
  );
}

export default MortgageCalculator;
