import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StatusChartProps {
  dititipkan: number;
  diambil: number;
  terlambat: number;
}

export function StatusChart({ dititipkan, diambil, terlambat }: StatusChartProps) {
  const data = [
    { name: 'Dititipkan', value: dititipkan },
    { name: 'Diambil', value: diambil },
    { name: 'Terlambat', value: terlambat },
  ];

  const COLORS = [
    'hsl(186, 72%, 38%)', // Dititipkan
    'hsl(142, 72%, 40%)', // Diambil
    'hsl(12, 90%, 55%)',  // Terlambat (merah)
  ];

  return (
    <div className="card-elevated p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Status Penitipan
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center p-3 rounded-lg bg-secondary">
          <p className="text-2xl font-bold text-primary">{dititipkan}</p>
          <p className="text-sm text-muted-foreground">Dititipkan</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-status-taken-bg">
          <p className="text-2xl font-bold text-status-taken">{diambil}</p>
          <p className="text-sm text-muted-foreground">Diambil</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-destructive/10">
          <p className="text-2xl font-bold text-destructive">{terlambat}</p>
          <p className="text-sm text-muted-foreground">Terlambat</p>
        </div>
      </div>
    </div>
  );
}
