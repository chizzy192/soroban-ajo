import React from 'react'
import type { Group, Member } from '@/types'

interface GroupAnalyticsProps {
  group?: Group
  members?: Member[]
  isLoading?: boolean
}
// TASK: IMPORTED RECHARTS COMPONENTS (#54)
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts'

interface PerformanceMetric {
  label: string
  value: number
  suffix: string
}

const AnalyticsSkeleton: React.FC = () => (
  <div className="space-y-6" aria-busy="true" aria-live="polite">
    <div className="space-y-2">
      <div className="skeleton h-8 w-56" />
      <div className="skeleton h-4 w-72" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="theme-surface p-6 rounded space-y-3">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-8 w-28" />
          <div className="skeleton h-4 w-16" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="theme-surface p-6 rounded space-y-4">
        <div className="skeleton h-6 w-44" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton h-10 w-full" />
          ))}
        </div>
      </div>
      <div className="theme-surface p-6 rounded space-y-4">
        <div className="skeleton h-6 w-40" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton h-14 w-full" />
          ))}
        </div>
      </div>
    </div>
  </div>
)

const EmptyAnalyticsState: React.FC = () => (
  <div className="theme-surface p-6 rounded" role="status" aria-live="polite">
    <h3 className="text-xl font-bold">No analytics data yet</h3>
    <p className="theme-muted mt-2">Start collecting member contributions to unlock contribution breakdown, payout schedule, and performance metrics.</p>
  </div>
)

const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`

const shortAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

const sampleGroup: Group = {
  id: 'group-1',
  name: 'Market Women Ajo',
  creator: 'GCREATORAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  cycleLength: 30,
  contributionAmount: 500,
  maxMembers: 10,
  currentMembers: 8,
  totalContributions: 4000,
  status: 'active',
  createdAt: '2026-01-01',
  nextPayoutDate: '2026-02-28',
}

const sampleMembers: Member[] = [
  {
    address: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    groupId: 'group-1',
    joinedDate: '2026-01-02',
    contributions: 500,
    status: 'active',
  },
  {
    address: 'GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
    groupId: 'group-1',
    joinedDate: '2026-01-03',
    contributions: 500,
    status: 'active',
  },
  {
    address: 'GCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    groupId: 'group-1',
    joinedDate: '2026-01-04',
    contributions: 500,
    status: 'active',
  },
  {
    address: 'GDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
    groupId: 'group-1',
    joinedDate: '2026-01-05',
    contributions: 500,
    status: 'active',
  },
  {
    address: 'GEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    groupId: 'group-1',
    joinedDate: '2026-01-06',
    contributions: 500,
    status: 'active',
  },
  {
    address: 'GFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
    groupId: 'group-1',
    joinedDate: '2026-01-07',
    contributions: 500,
    status: 'active',
  },
  {
    address: 'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
    groupId: 'group-1',
    joinedDate: '2026-01-08',
    contributions: 0,
    status: 'inactive',
  },
  {
    address: 'GHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',
    groupId: 'group-1',
    joinedDate: '2026-01-09',
    contributions: 0,
    status: 'active',
  },
]

const buildPayoutSchedule = (group: Group) => {
  const baseDate = new Date(group.nextPayoutDate)
  const activeCycles = Math.min(group.currentMembers, 4)

  return Array.from({ length: activeCycles }, (_, index) => {
    const payoutDate = new Date(baseDate)
    payoutDate.setDate(baseDate.getDate() + index * group.cycleLength)

    return {
      cycle: index + 1,
      date: payoutDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      amount: group.contributionAmount * group.currentMembers,
      status: index === 0 ? 'upcoming' : 'scheduled',
    }
  })
}

export const GroupAnalytics: React.FC<GroupAnalyticsProps> = ({
  group = sampleGroup,
  members = sampleMembers,
  isLoading = false,
}) => {
  if (isLoading) {
    return <AnalyticsSkeleton />
  }

  const activeMembers = members.filter((member) => member.status === 'active')
  const totalFromMembers = members.reduce((total, member) => total + member.contributions, 0)
  const totalContributions = Math.max(group.totalContributions, totalFromMembers)
  const expectedPerCycle = group.currentMembers * group.contributionAmount
  const completionRate = expectedPerCycle > 0 ? Math.min((totalContributions / expectedPerCycle) * 100, 100) : 0
  const averageContribution = members.length > 0 ? totalContributions / members.length : 0
  const payoutSchedule = buildPayoutSchedule(group)
  const hasData = members.length > 0 || totalContributions > 0

  if (!hasData) {
    return <EmptyAnalyticsState />
  }

  const performanceMetrics: PerformanceMetric[] = [
    { label: 'Funding Progress', value: completionRate, suffix: '%' },
    {
      label: 'Member Participation',
      value: group.currentMembers > 0 ? (activeMembers.length / group.currentMembers) * 100 : 0,
      suffix: '%',
    },
    {
      label: 'Contribution Consistency',
      value:
        group.currentMembers > 0
          ? ((members.filter((member) => member.contributions > 0).length / group.currentMembers) * 100)
          : 0,
      suffix: '%',
    },
    { label: 'Average Contribution', value: averageContribution, suffix: '$' },
  ]

  // TASK: ADDED DUMMY DATA FOR THE CHARTS TO RENDER (#54)
  const trendData = [
    { name: 'Jan', amount: 4000 },
    { name: 'Feb', amount: 3000 },
    { name: 'Mar', amount: 5000 },
    { name: 'Apr', amount: 4500 },
    { name: 'May', amount: 6000 },
    { name: 'Jun', amount: 5500 },
  ]

  const timelineData = [
    { name: 'Week 1', completed: 4, pending: 2 },
    { name: 'Week 2', completed: 3, pending: 4 },
    { name: 'Week 3', completed: 5, pending: 1 },
    { name: 'Week 4', completed: 2, pending: 3 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Group Analytics</h2>
        <p className="theme-muted">Track contribution health, payout readiness, and member performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="theme-surface p-6 rounded">
          <p className="text-sm theme-muted">Total Contributions</p>
          <p className="text-2xl font-bold mt-2">{formatCurrency(totalContributions)}</p>
          <p className="text-sm theme-success mt-1">Current cycle total</p>
        </div>
        <div className="theme-surface p-6 rounded">
          <p className="text-sm theme-muted">Member Contributions</p>
          <p className="text-2xl font-bold mt-2">{members.filter((member) => member.contributions > 0).length}/{group.currentMembers}</p>
          <p className="text-sm theme-muted mt-1">Members with active contribution</p>
        </div>
        <div className="theme-surface p-6 rounded">
          <p className="text-sm theme-muted">Next Payout</p>
          <p className="text-2xl font-bold mt-2">
            {new Date(group.nextPayoutDate).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p className="text-sm theme-muted mt-1">{formatCurrency(group.contributionAmount * group.currentMembers)} scheduled</p>
        </div>
        <div className="theme-surface p-6 rounded">
          <p className="text-sm theme-muted">Avg Contribution</p>
          <p className="text-2xl font-bold mt-2">{formatCurrency(averageContribution)}</p>
          <p className="text-sm theme-muted mt-1">Per member</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="theme-surface p-6 rounded">
          <h3 className="text-xl font-bold mb-4">Member Contribution Breakdown</h3>
          {members.length === 0 ? (
            <div className="theme-surface-muted rounded p-4">
              <p className="theme-muted">No member contributions available yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {members
                .slice()
                .sort((a, b) => b.contributions - a.contributions)
                .map((member) => {
                  const share = totalContributions > 0 ? (member.contributions / totalContributions) * 100 : 0
                  return (
                    <div key={member.address} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-mono theme-muted">{shortAddress(member.address)}</span>
                        <span className="font-semibold">{formatCurrency(member.contributions)}</span>
                      </div>
                      <progress
                        className="w-full h-2 theme-surface-muted rounded overflow-hidden"
                        value={Math.min(share, 100)}
                        max={100}
                      />
                    </div>
                  )
                })}
            </div>
          )}
        </div>

        <div className="theme-surface p-6 rounded">
          <h3 className="text-xl font-bold mb-4">Payout Schedule</h3>
          <div className="space-y-3">
            {payoutSchedule.map((item) => (
              <div key={`${item.cycle}-${item.date}`} className="theme-surface-muted p-4 rounded flex items-center justify-between">
                <div>
                  <p className="font-semibold">Cycle {item.cycle}</p>
                  <p className="text-sm theme-muted">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(item.amount)}</p>
                  <p className={`text-sm ${item.status === 'upcoming' ? 'theme-primary' : 'theme-muted'}`}>
                    {item.status === 'upcoming' ? 'Upcoming' : 'Scheduled'}
                  </p>
                </div>
              </div>
            ))}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Contribution Trends</h3>
          {/* Note: I removed the flex justify-center classes from this specific div so Recharts can expand properly */}
          <div className="h-64 bg-gray-50 rounded pt-4 pr-4">
            {/* TASK: IMPLEMENTED AREA CHART WITH CSS VARIABLES AND TOOLTIP STYLING (#54) */}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--chart-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-line)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--chart-tooltip-bg)', 
                    borderColor: 'var(--chart-tooltip-border)', 
                    color: 'var(--chart-tooltip-text)',
                    borderRadius: '8px' 
                  }} 
                />
                <Area type="monotone" dataKey="amount" stroke="var(--chart-primary)" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Payout Timeline</h3>
          {/* Note: Removed flex justify-center here as well so Recharts fills the container */}
          <div className="h-64 bg-gray-50 rounded pt-4 pr-4">
            {/* TASK: IMPLEMENTED BAR CHART WITH CSS VARIABLES, SPACING, AND LEGEND (#54) */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-line)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--chart-tooltip-bg)', 
                    borderColor: 'var(--chart-tooltip-border)', 
                    color: 'var(--chart-tooltip-text)',
                    borderRadius: '8px' 
                  }} 
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                <Bar dataKey="completed" fill="var(--chart-primary)" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="pending" fill="var(--chart-secondary)" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="theme-surface p-6 rounded">
        <h3 className="text-xl font-bold mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {performanceMetrics.map((metric) => {
            const valueLabel = metric.suffix === '$' ? formatCurrency(metric.value) : `${metric.value.toFixed(0)}${metric.suffix}`

            return (
              <div key={metric.label} className="theme-surface-muted p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">{metric.label}</p>
                  <p className="text-sm font-semibold">{valueLabel}</p>
                </div>
                <progress
                  className="w-full h-2 bg-[color:var(--color-border)] rounded overflow-hidden"
                  value={metric.suffix === '$' ? Math.min((metric.value / group.contributionAmount) * 100, 100) : Math.min(metric.value, 100)}
                  max={100}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}