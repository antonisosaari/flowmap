import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Monitor, 
  MousePointerClick, 
  Navigation, 
  GitBranch, 
  CheckCircle2 
} from 'lucide-react';
import type { FlowNode, NodeType } from '../types';

const nodeConfig: Record<NodeType, { 
  icon: React.ElementType; 
  bgClass: string;
  borderClass: string;
  iconClass: string;
}> = {
  screen: { 
    icon: Monitor, 
    bgClass: 'bg-blue-500/20',
    borderClass: 'border-blue-500/30',
    iconClass: 'text-blue-400'
  },
  action: { 
    icon: MousePointerClick, 
    bgClass: 'bg-green-500/20',
    borderClass: 'border-green-500/30',
    iconClass: 'text-green-400'
  },
  navigation: { 
    icon: Navigation, 
    bgClass: 'bg-purple-500/20',
    borderClass: 'border-purple-500/30',
    iconClass: 'text-purple-400'
  },
  state: { 
    icon: GitBranch, 
    bgClass: 'bg-amber-500/20',
    borderClass: 'border-amber-500/30',
    iconClass: 'text-amber-400'
  },
  result: { 
    icon: CheckCircle2, 
    bgClass: 'bg-teal-500/20',
    borderClass: 'border-teal-500/30',
    iconClass: 'text-teal-400'
  },
};

interface TreeNodeProps {
  node: FlowNode;
  depth?: number;
  expandAll?: boolean;
  collapseAll?: boolean;
  onExpandChange?: () => void;
}

export function TreeNode({ 
  node, 
  depth = 0, 
  expandAll, 
  collapseAll,
  onExpandChange 
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const config = nodeConfig[node.type];
  const Icon = config.icon;

  useEffect(() => {
    if (expandAll !== undefined && expandAll) {
      setIsExpanded(true);
    }
  }, [expandAll]);

  useEffect(() => {
    if (collapseAll !== undefined && collapseAll) {
      setIsExpanded(false);
    }
  }, [collapseAll]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    onExpandChange?.();
  };

  return (
    <div className="relative">
      {/* Connection line from parent */}
      {depth > 0 && (
        <div 
          className="absolute left-0 top-0 w-px bg-white/10"
          style={{ 
            height: '20px',
            left: `${(depth - 1) * 24 + 12}px`
          }}
        />
      )}
      
      {/* Node content */}
      <div 
        className="flex items-start gap-2 py-1"
        style={{ paddingLeft: `${depth * 24}px` }}
      >
        {/* Expand/collapse button or spacer */}
        <button
          onClick={hasChildren ? toggleExpand : undefined}
          className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors ${
            hasChildren 
              ? 'hover:bg-white/10 cursor-pointer' 
              : 'cursor-default'
          }`}
          disabled={!hasChildren}
        >
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </motion.div>
          )}
        </button>

        {/* Node pill */}
        <button
          onClick={hasChildren ? toggleExpand : undefined}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bgClass} ${config.borderClass} ${
            hasChildren ? 'cursor-pointer hover:brightness-110' : 'cursor-default'
          } transition-all`}
        >
          <Icon className={`w-4 h-4 ${config.iconClass}`} />
          <span className="text-sm font-medium text-gray-100">{node.label}</span>
        </button>

        {/* Description */}
        {node.description && (
          <span className="text-xs text-gray-500 self-center ml-2 hidden sm:inline">
            {node.description}
          </span>
        )}
      </div>

      {/* Children */}
      <AnimatePresence initial={false}>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {/* Vertical connection line */}
            <div 
              className="absolute bg-white/10"
              style={{ 
                width: '1px',
                left: `${depth * 24 + 12}px`,
                top: '32px',
                bottom: '12px'
              }}
            />
            
            {node.children!.map((child, index) => (
              <div key={index} className="relative">
                {/* Horizontal connection line */}
                <div 
                  className="absolute bg-white/10"
                  style={{ 
                    height: '1px',
                    width: '12px',
                    left: `${depth * 24 + 12}px`,
                    top: '16px'
                  }}
                />
                <TreeNode 
                  node={child} 
                  depth={depth + 1}
                  expandAll={expandAll}
                  collapseAll={collapseAll}
                  onExpandChange={onExpandChange}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
