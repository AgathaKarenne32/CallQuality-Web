import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function GraficoEvolucao({ dados }) {
  const dataFinal = dados && dados.length > 0 ? dados : [
    { nome: '0', nota: 0 }, { nome: '0', nota: 0 }
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
      <h3 className="font-bold text-slate-700 mb-4">Tendência de Qualidade</h3>

      {/* Tamanho fixo para evitar erro de width(-1) */}
      <div className="flex justify-center overflow-x-auto">
        <LineChart width={800} height={300} data={dataFinal}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="nota"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ fill: '#2563eb' }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>
    </div>
  );
}
