export default function Dashboard() {
  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border h-screen flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              AI
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Graphics Studio Pro</h1>
              <p className="text-sm text-muted-foreground">Advanced AI Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6">
          <div className="space-y-2 px-4">
            {[
              { href: '/', label: 'Dashboard', icon: '🏠', active: true },
              { href: '/projects', label: 'Projects', icon: '🎨', badge: '24' },
              { href: '/library', label: 'Library', icon: '📁', badge: '1.2k' },
              { href: '/editor', label: 'Advanced Editor', icon: '🎭' },
              { href: '/settings', label: 'Settings', icon: '⚙️' }
            ].map((item, index) => (
              <div key={index} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                item.active ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}>
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-md font-semibold">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              U
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">User</div>
              <div className="text-xs text-muted-foreground">Pro Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-card/95 backdrop-blur-sm border-b border-border px-6 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Professional graphics automation workspace</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                ✨ New Project
              </button>
              <button className="px-6 py-3 border border-border bg-background rounded-lg font-semibold hover:bg-accent transition-all">
                🎭 Advanced Editor
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-muted/20 p-8">
          {/* Welcome Section */}
          <div className="mb-8 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl p-8 text-center border border-violet-200 dark:border-violet-800">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to AI Graphics Studio Pro
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Create professional graphics campaigns with AI automation
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-lg">
                🚀 Start Creating
              </button>
              <button className="px-8 py-4 border border-border bg-background rounded-xl font-bold hover:bg-accent transition-all text-lg">
                ⚙️ Setup API
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Total Projects', value: '24', icon: '🎨', color: 'bg-blue-500/15' },
              { title: 'Images Generated', value: '1,248', icon: '⚡', color: 'bg-green-500/15' },
              { title: 'AI Masks Created', value: '156', icon: '🎭', color: 'bg-purple-500/15' },
              { title: 'Time Saved', value: '98%', icon: '📈', color: 'bg-orange-500/15' }
            ].map((metric, index) => (
              <div key={index} className="bg-card border border-border rounded-xl shadow-sm hover:shadow-lg transition-all p-6 group cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {metric.icon}
                  </div>
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md font-semibold">+12%</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{metric.title}</p>
                  <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Projects */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Recent Projects</h2>
            <div className="space-y-4">
              {[
                { name: 'Fitness Supplements Campaign', status: 'Completed', progress: 100, color: 'from-green-500 to-emerald-500' },
                { name: 'Probiotics Health Series', status: 'In Progress', progress: 75, color: 'from-blue-500 to-cyan-500' },
                { name: 'Skincare Collection', status: 'In Progress', progress: 45, color: 'from-purple-500 to-pink-500' }
              ].map((project, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-accent/30 transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${project.color} flex items-center justify-center text-white font-bold`}>
                    {project.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                    <div className="text-sm text-muted-foreground mb-2">{project.status} • {project.progress}%</div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}