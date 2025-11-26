import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DADOS_MOCK = [
  { name: 'Positivo', value: 45, color: '#22c55e' }, // Green-500
  { name: 'Neutro', value: 30, color: '#94a3b8' },   // Slate-400
  { name: 'Negativo', value: 25, color: '#ef4444' },  // Red-500
];

export function GraficoSentimentos() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80 flex flex-col">
      <h3 className="font-bold text-slate-700 mb-4">Distribuição de Sentimentos</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DADOS_MOCK}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {DADOS_MOCK.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
