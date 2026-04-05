import { motion } from "framer-motion";

const integrations = [
  { name: "Salesforce", color: "#00A1E0", icon: "S" },
  { name: "HubSpot", color: "#FF7A59", icon: "H" },
  { name: "Jira", color: "#0052CC", icon: "J" },
  { name: "Slack", color: "#4A154B", icon: "S" },
  { name: "Microsoft Teams", color: "#6264A7", icon: "T" },
  { name: "Google Drive", color: "#FFBA00", icon: "G" },
  { name: "SharePoint", color: "#0078D4", icon: "S" },
  { name: "Dropbox", color: "#0061FF", icon: "D" },
];

export function IntegrationsSection() {
  return (
    <section className="py-32 relative z-10 bg-[#030303] overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37]/5 blur-[120px] rounded-[100%] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight"
          >
            Connects with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-[#D4AF37]">existing workflow.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg font-light"
          >
            BidForge seamlessly integrates with your CRM, communication tools, and cloud storage to pull context instantly and sync completed responses automatically.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, borderColor: "rgba(212,175,55,0.3)" }}
              className="flex justify-center items-center p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm cursor-pointer transition-colors group"
            >
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex justify-center items-center text-xl font-bold shadow-lg"
                  style={{ backgroundColor: `${integration.color}20`, color: integration.color }}
                >
                  {integration.icon}
                </div>
                <span className="text-sm text-gray-500 font-medium group-hover:text-gray-300 transition-colors">
                  {integration.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
