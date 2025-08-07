"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import React, { JSX } from "react";
import { ChartPieProps } from "#/types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#845EC2"];

const ChartPie = ({ accounts }: ChartPieProps): JSX.Element => {
  // Maneja el caso en que accounts sea undefined o vacío
  if (!accounts || accounts.length === 0) {
    return (
      <div
        style={{
          width: 120,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span>No data</span>
      </div>
    );
  }

  const chartData = accounts.map(account => ({
    name: account.name,
    value: account.currentBalance || 0, // Asegúrate de que currentBalance sea un número
  }));

  return (
    <ResponsiveContainer width={120} height={120}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={50}
          innerRadius={30}
          fill="#8884d8"
          paddingAngle={5}
          stroke="none"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "8px",
            fontSize: "10px",
          }}
          formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ChartPie;
