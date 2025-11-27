import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function GraficoEvolucao({ dados }) {
  // Se não tiver dados, mockamos uma linha reta zerada
  const dataFinal = dados && dados.length > 0 ? dados : [
    { nome: '0', nota: 0 }, { nome: '0', nota: 0 }
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
      <h3 className="font-bold text-slate-700 mb-4">Tendência de Qualidade (Últimas Chamadas)</h3>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <LineChart data={dataFinal}>
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
        </ResponsiveContainer>
      </div>
    </div>
  );
}
