import { useState, useMemo } from 'react'
import './ToolSelector.css'

// Available tools with their locations in the warehouse
const warehouseTools = [
  {
    id: 'forklift-1',
    name: 'Forklift #1',
    type: 'forklift',
    icon: '🚜',
    location: 'Tool Station A',
    x: 100,
    y: 480,
    description: 'For heavy pallets (>100kg)',
    requiredFor: ['heavy', 'pallet', 'bulk']
  },
  {
    id: 'forklift-2',
    name: 'Forklift #2',
    type: 'forklift',
    icon: '🚜',
    location: 'Tool Station C',
    x: 650,
    y: 480,
    description: 'For heavy pallets (>100kg)',
    requiredFor: ['heavy', 'pallet', 'bulk']
  },
  {
    id: 'pallet-jack-1',
    name: 'Pallet Jack #1',
    type: 'pallet_jack',
    icon: '🏗️',
    location: 'Tool Station A',
    x: 120,
    y: 460,
    description: 'For medium pallets (50-100kg)',
    requiredFor: ['medium', 'pallet']
  },
  {
    id: 'pallet-jack-2',
    name: 'Pallet Jack #2',
    type: 'pallet_jack',
    icon: '🏗️',
    location: 'Tool Station B',
    x: 400,
    y: 100,
    description: 'For medium pallets (50-100kg)',
    requiredFor: ['medium', 'pallet']
  },
  {
    id: 'ladder-1',
    name: 'Step Ladder (6ft)',
    type: 'ladder',
    icon: '🪜',
    location: 'Tool Station A',
    x: 140,
    y: 440,
    description: 'For shelves 2-3 (medium height)',
    requiredFor: ['high-shelf', 'shelf-2', 'shelf-3']
  },
  {
    id: 'ladder-2',
    name: 'Step Ladder (6ft)',
    type: 'ladder',
    icon: '🪜',
    location: 'Tool Station B',
    x: 420,
    y: 120,
    description: 'For shelves 2-3 (medium height)',
    requiredFor: ['high-shelf', 'shelf-2', 'shelf-3']
  },
  {
    id: 'ladder-tall-1',
    name: 'Tall Ladder (12ft)',
    type: 'tall_ladder',
    icon: '🪜',
    location: 'Tool Station C',
    x: 670,
    y: 460,
    description: 'For shelves 4-5 (top shelves)',
    requiredFor: ['top-shelf', 'shelf-4', 'shelf-5']
  },
  {
    id: 'scanner-1',
    name: 'Barcode Scanner',
    type: 'scanner',
    icon: '📱',
    location: 'Tool Station A',
    x: 160,
    y: 480,
    description: 'For inventory verification',
    requiredFor: ['verification', 'counting']
  },
  {
    id: 'scanner-2',
    name: 'Barcode Scanner',
    type: 'scanner',
    icon: '📱',
    location: 'Tool Station B',
    x: 440,
    y: 100,
    description: 'For inventory verification',
    requiredFor: ['verification', 'counting']
  },
  {
    id: 'cart-1',
    name: 'Picking Cart',
    type: 'cart',
    icon: '🛒',
    location: 'Tool Station A',
    x: 180,
    y: 460,
    description: 'For multiple small items',
    requiredFor: ['multiple', 'small-items']
  },
  {
    id: 'cart-2',
    name: 'Picking Cart',
    type: 'cart',
    icon: '🛒',
    location: 'Tool Station C',
    x: 630,
    y: 440,
    description: 'For multiple small items',
    requiredFor: ['multiple', 'small-items']
  },
  {
    id: 'gloves-1',
    name: 'Safety Gloves',
    type: 'safety',
    icon: '🧤',
    location: 'Tool Station B',
    x: 380,
    y: 120,
    description: 'For handling fragile/heavy items',
    requiredFor: ['fragile', 'heavy', 'glass']
  },
  {
    id: 'hand-truck-1',
    name: 'Hand Truck',
    type: 'hand_truck',
    icon: '🛞',
    location: 'Tool Station A',
    x: 200,
    y: 480,
    description: 'For boxes and cartons',
    requiredFor: ['boxes', 'cartons', 'stacked']
  }
]

// Tool categories for grouping
const toolCategories = [
  { id: 'lifting', name: 'Lifting Equipment', types: ['forklift', 'pallet_jack', 'hand_truck'] },
  { id: 'climbing', name: 'Climbing Equipment', types: ['ladder', 'tall_ladder'] },
  { id: 'transport', name: 'Transport', types: ['cart'] },
  { id: 'scanning', name: 'Scanning & Verification', types: ['scanner'] },
  { id: 'safety', name: 'Safety Equipment', types: ['safety'] }
]

function ToolSelector({ isOpen, onClose, onConfirm, selectedProduct, workerPosition }) {
  const [needsTools, setNeedsTools] = useState(null) // null = not answered, true/false
  const [selectedTools, setSelectedTools] = useState([])
  const [expandedCategory, setExpandedCategory] = useState(null)

  // Get recommended tools based on product shelf
  const recommendedTools = useMemo(() => {
    if (!selectedProduct) return []
    
    const shelf = selectedProduct.shelf
    const recommendations = []
    
    // Recommend ladder based on shelf height
    if (shelf >= 4) {
      recommendations.push('tall_ladder')
    } else if (shelf >= 2) {
      recommendations.push('ladder')
    }
    
    // Recommend cart for small items or multiple picks
    if (selectedProduct.quantity > 10) {
      recommendations.push('cart')
    }
    
    // Always recommend scanner
    recommendations.push('scanner')
    
    return recommendations
  }, [selectedProduct])

  // Group tools by category
  const groupedTools = useMemo(() => {
    return toolCategories.map(category => ({
      ...category,
      tools: warehouseTools.filter(tool => category.types.includes(tool.type))
    }))
  }, [])

  // Calculate distance from worker to tool
  const getToolDistance = (tool) => {
    const dx = tool.x - workerPosition.x
    const dy = tool.y - workerPosition.y
    return Math.round(Math.sqrt(dx * dx + dy * dy))
  }

  // Find nearest tool of each type
  const getNearestToolOfType = (type) => {
    const toolsOfType = warehouseTools.filter(t => t.type === type)
    if (toolsOfType.length === 0) return null
    
    return toolsOfType.reduce((nearest, tool) => {
      const dist = getToolDistance(tool)
      const nearestDist = nearest ? getToolDistance(nearest) : Infinity
      return dist < nearestDist ? tool : nearest
    }, null)
  }

  const handleToolToggle = (tool) => {
    setSelectedTools(prev => {
      const isSelected = prev.find(t => t.id === tool.id)
      if (isSelected) {
        return prev.filter(t => t.id !== tool.id)
      } else {
        // Remove other tools of same type and add this one
        const filteredPrev = prev.filter(t => t.type !== tool.type)
        return [...filteredPrev, tool]
      }
    })
  }

  const handleConfirm = () => {
    if (needsTools === false) {
      onConfirm([]) // No tools needed
    } else {
      onConfirm(selectedTools)
    }
    // Reset state
    setNeedsTools(null)
    setSelectedTools([])
  }

  const handleSkip = () => {
    onConfirm([])
    setNeedsTools(null)
    setSelectedTools([])
  }

  if (!isOpen) return null

  return (
    <div className="tool-selector-overlay">
      <div className="tool-selector-modal">
        {/* Header */}
        <div className="tool-modal-header">
          <div className="header-icon">🧰</div>
          <div className="header-text">
            <h2>Tool Selection</h2>
            <p>Product: <strong>{selectedProduct?.name}</strong> at Rack {selectedProduct?.rack}, Shelf {selectedProduct?.shelf}</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Initial Question */}
        {needsTools === null && (
          <div className="tool-question">
            <div className="question-icon">❓</div>
            <h3>Do you need any tools to retrieve this product?</h3>
            <p className="question-hint">
              {selectedProduct?.shelf >= 3 
                ? '⚠️ This product is on a high shelf - a ladder may be required'
                : 'Select tools if needed for safe and efficient retrieval'}
            </p>
            <div className="question-buttons">
              <button 
                className="question-btn yes"
                onClick={() => setNeedsTools(true)}
              >
                <span>✅</span> Yes, I need tools
              </button>
              <button 
                className="question-btn no"
                onClick={() => setNeedsTools(false)}
              >
                <span>❌</span> No, proceed directly
              </button>
            </div>
          </div>
        )}

        {/* Tool Selection */}
        {needsTools === true && (
          <div className="tool-selection">
            {/* Recommended Tools */}
            {recommendedTools.length > 0 && (
              <div className="recommended-section">
                <h4>🎯 Recommended Tools</h4>
                <div className="recommended-tools">
                  {recommendedTools.map(type => {
                    const tool = getNearestToolOfType(type)
                    if (!tool) return null
                    const isSelected = selectedTools.find(t => t.id === tool.id)
                    
                    return (
                      <div 
                        key={tool.id}
                        className={`recommended-tool ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleToolToggle(tool)}
                      >
                        <span className="tool-icon">{tool.icon}</span>
                        <div className="tool-info">
                          <span className="tool-name">{tool.name}</span>
                          <span className="tool-location">📍 {tool.location} ({getToolDistance(tool)}m away)</span>
                        </div>
                        <span className="select-indicator">{isSelected ? '✓' : '+'}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* All Tools by Category */}
            <div className="all-tools-section">
              <h4>📦 All Available Tools</h4>
              {groupedTools.map(category => (
                <div key={category.id} className="tool-category">
                  <div 
                    className={`category-header ${expandedCategory === category.id ? 'expanded' : ''}`}
                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  >
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">{category.tools.length} tools</span>
                    <span className="expand-icon">{expandedCategory === category.id ? '▼' : '▶'}</span>
                  </div>
                  
                  {expandedCategory === category.id && (
                    <div className="category-tools">
                      {category.tools.map(tool => {
                        const isSelected = selectedTools.find(t => t.id === tool.id)
                        const distance = getToolDistance(tool)
                        
                        return (
                          <div 
                            key={tool.id}
                            className={`tool-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleToolToggle(tool)}
                          >
                            <span className="tool-icon">{tool.icon}</span>
                            <div className="tool-details">
                              <span className="tool-name">{tool.name}</span>
                              <span className="tool-desc">{tool.description}</span>
                              <span className="tool-location">📍 {tool.location} • {distance}m away</span>
                            </div>
                            <div className="tool-select">
                              <span className={`checkbox ${isSelected ? 'checked' : ''}`}>
                                {isSelected ? '✓' : ''}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Selected Tools Summary */}
            {selectedTools.length > 0 && (
              <div className="selected-summary">
                <h4>🛠️ Selected Tools ({selectedTools.length})</h4>
                <div className="selected-tools-list">
                  {selectedTools.map(tool => (
                    <div key={tool.id} className="selected-tool-chip">
                      <span>{tool.icon} {tool.name}</span>
                      <button onClick={() => handleToolToggle(tool)}>✕</button>
                    </div>
                  ))}
                </div>
                <p className="route-preview">
                  📍 Route: Worker → {selectedTools.map(t => t.location).join(' → ')} → Rack {selectedProduct?.rack}
                </p>
              </div>
            )}
          </div>
        )}

        {/* No Tools Confirmation */}
        {needsTools === false && (
          <div className="no-tools-confirm">
            <div className="confirm-icon">✅</div>
            <h3>Proceeding without tools</h3>
            <p>Shortest path will be calculated directly to the product location.</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="tool-modal-footer">
          {needsTools !== null && (
            <>
              <button className="back-btn" onClick={() => setNeedsTools(null)}>
                ← Back
              </button>
              <button className="skip-btn" onClick={handleSkip}>
                Skip Tools
              </button>
              <button 
                className="confirm-btn"
                onClick={handleConfirm}
                disabled={needsTools === true && selectedTools.length === 0}
              >
                {needsTools === true 
                  ? `Calculate Route with ${selectedTools.length} Tool${selectedTools.length !== 1 ? 's' : ''}` 
                  : 'Calculate Direct Route'
                } →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export { warehouseTools }
export default ToolSelector
