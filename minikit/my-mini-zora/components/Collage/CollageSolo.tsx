import { CollageImage } from './CollageImage'
import { ZoraToken } from '@/app/api/zora-tokens/route'

export function Collage({ tokens, displayName, selectedToken, setSelectedToken }: { tokens: ZoraToken[], displayName: string, selectedToken: ZoraToken | null, setSelectedToken: (token: ZoraToken | null) => void }) {
  // Create a safe tokens array with fallbacks for missing items
  const safeTokens = tokens || [];

  // Updated layout configuration for vertical masonry layout
  const layoutConfig = [
    { gridArea: "top1", position: 0, bgColor: "#E04E5D" }, // Top left - red
    { gridArea: "top2", position: 1, bgColor: "#F4DC7D" }, // Top right - yellow
    { gridArea: "middle", position: 2, bgColor: "#F9F6E5" }, // Middle - cream
    { gridArea: "right", position: 3, bgColor: "#E04E5D" }, // Right - red
    { gridArea: "bottom", position: 4, bgColor: "#E04E5D" }, // Bottom - red
  ];

  return (
    <div className="w-full">
      <div id="collage-container" className="relative w-full max-w-[800px] mx-auto px-2 py-4">
        {/* Main title below the grid */}
        <div className="text-center my-4 py-3">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-500"
              style={{ fontFamily: 'monospace' }}>
            {displayName || 'soheybuildsbase'}
          </h1>
        </div>

        {/* Full grid layout using CSS grid with minimal gaps */}
        <div 
          className="grid grid-cols-6 gap-[2px]" 
          style={{
            gridTemplateAreas: `
              "top1 top1 top2 top2 top2 top2"
              "middle middle middle middle right right"
              "middle-bottom middle-bottom middle-bottom middle-bottom bottomRight bottomRight"
            `,
            gridAutoRows: "auto",
          }}
        >
          {/* Top left - red */}
          <div 
            style={{ 
              gridArea: 'top1',
              backgroundColor: layoutConfig[0].bgColor
            }}
            className="aspect-square"
          >
            {safeTokens[0] && (
              <CollageImage 
                token={safeTokens[0]}
                src={safeTokens[0].imageUrl?.medium || '/placeholder.svg'}
                alt={safeTokens[0].name || 'Token 1'}
                className={`h-full w-full object-cover ${selectedToken?.name === safeTokens[0].name ? 'border-2 border-blue-500' : ''}`}
                onClick={() => safeTokens[0] && setSelectedToken(safeTokens[0])}
              />
            )}
          </div>
          
          {/* Top right - yellow */}
          <div 
            style={{ 
              gridArea: 'top2',
              backgroundColor: layoutConfig[1].bgColor
            }}
            className="aspect-[2/1]"
          >
            {safeTokens[1] && (
              <CollageImage 
                token={safeTokens[1]}
                src={safeTokens[1].imageUrl?.medium || '/placeholder.svg'}
                alt={safeTokens[1].name || 'Token 2'}
                className={`h-full w-full object-cover ${selectedToken?.name === safeTokens[1].name ? 'border-2 border-blue-500' : ''}`}
                onClick={() => safeTokens[1] && setSelectedToken(safeTokens[1])}
              />
            )}
          </div>
          
          {/* Middle - cream - ENLARGED to take more vertical space */}
          <div 
            style={{ 
              gridArea: 'middle',
              backgroundColor: layoutConfig[2].bgColor
            }}
            className="aspect-[4/5]"
          >
            {safeTokens[2] && (
              <CollageImage 
                token={safeTokens[2]}
                src={safeTokens[2].imageUrl?.medium || '/placeholder.svg'}
                alt={safeTokens[2].name || 'Token 3'}
                className={`h-full w-full object-cover ${selectedToken?.name === safeTokens[2].name ? 'border-2 border-blue-500' : ''}`}
                priority
                onClick={() => safeTokens[2] && setSelectedToken(safeTokens[2])}
              />
            )}
          </div>
          
          {/* Right - red */}
          <div 
            style={{ 
              gridArea: 'right',
              backgroundColor: layoutConfig[3].bgColor
            }}
            className="aspect-[1/2]"
          >
            {safeTokens[3] && (
              <CollageImage 
                token={safeTokens[3]}
                src={safeTokens[3].imageUrl?.medium || '/placeholder.svg'}
                alt={safeTokens[3].name || 'Token 4'}
                className={`h-full w-full object-cover ${selectedToken?.name === safeTokens[3].name ? 'border-2 border-blue-500' : ''}`}
                onClick={() => safeTokens[3] && setSelectedToken(safeTokens[3])}
              />
            )}
          </div>
          
          {/* Bottom left - red - MADE EXTRA LARGE to fill the fluid image */}
          <div 
            style={{ 
              gridArea: 'middle-bottom',
              backgroundColor: layoutConfig[4].bgColor
            }}
            className="aspect-auto min-h-[250px]"
          >
            {safeTokens[4] && (
              <CollageImage 
                token={safeTokens[4]}
                src={safeTokens[4].imageUrl?.medium || '/placeholder.svg'}
                alt={safeTokens[4].name || 'Token 5'}
                className={`h-full w-full object-cover ${selectedToken?.name === safeTokens[4].name ? 'border-2 border-blue-500' : ''}`}
                onClick={() => safeTokens[4] && setSelectedToken(safeTokens[4])}
              />
            )}
          </div>
          
          {/* "Built with MiniKit" text in bottomRight area - always cream colored */}
          <div 
            style={{ 
              gridArea: 'bottomRight',
              backgroundColor: "#F9F6E5"
            }}
            className="aspect-square flex items-center justify-center"
          >
            <div className="text-center p-4">
              <p className="text-[#FF1493] font-medium text-sm md:text-base">built with</p>
              <p className="text-[#FF1493] font-bold text-lg md:text-xl mt-1">MiniKit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}