import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export function GraficoSentimentos({ dados }) {
  const dataFinal = dados && dados.length > 0 ? dados : [
    { name: 'Aguardando', value: 100, color: '#f1f5f9' }
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center h-full">
      <h3 className="font-bold text-slate-700 mb-4 w-full text-left">Distribuição de Sentimentos</h3>

      {/* SOLUÇÃO NUCLEAR: Tamanho fixo direto no componente, sem ResponsiveContainer */}
      <div className="flex justify-center items-center w-full">
        <PieChart width={300} height={300}>
          <Pie
            data={dataFinal}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {dataFinal.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </div>
    </div>
  );
}
