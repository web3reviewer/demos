import { CollageImage } from './CollageImage'
import { ZoraToken } from '@/app/api/zora-tokens/route'

export function Collage({ tokens, displayName, selectedToken, setSelectedToken }: { tokens: ZoraToken[], displayName: string, selectedToken: ZoraToken | null, setSelectedToken: (token: ZoraToken | null) => void }) {
  // Create a safe tokens array with fallbacks for missing items
  const safeTokens = tokens || [];

  return (
    <div className="w-full">
      {/* Grid layout that precisely matches the image */}
      <div className="grid grid-cols-3 gap-2">
        {/* Top row - 3 images */}
        <div className="aspect-square">
          {safeTokens[0] && (
            <CollageImage 
              token={safeTokens[0]}
              src={safeTokens[0].imageUrl?.medium || '/placeholder.svg'}
              alt={safeTokens[0].name || 'Token 1'}
              className={`${selectedToken?.name === safeTokens[0].name ? 'border-2 border-blue-500' : ''}`}
              onClick={() => safeTokens[0] && setSelectedToken(safeTokens[0])}
            />
          )}
        </div>
        
        <div className="aspect-square">
          {safeTokens[1] && (
            <CollageImage 
              token={safeTokens[1]}
              src={safeTokens[1].imageUrl?.medium || '/placeholder.svg'}
              alt={safeTokens[1].name || 'Token 2'}
              className={`${selectedToken?.name === safeTokens[1].name ? 'border-2 border-blue-500' : ''}`}
              onClick={() => safeTokens[1] && setSelectedToken(safeTokens[1])}
            />
          )}
        </div>
        
        <div className="aspect-square">
          {safeTokens[2] && (
            <CollageImage 
              token={safeTokens[2]}
              src={safeTokens[2].imageUrl?.medium || '/placeholder.svg'}
              alt={safeTokens[2].name || 'Token 3'}
              className={`${selectedToken?.name === safeTokens[2].name ? 'border-2 border-blue-500' : ''}`}
              onClick={() => safeTokens[2] && setSelectedToken(safeTokens[2])}
            />
          )}
        </div>
        
        {/* Middle row - Image on left, empty middle and right */}
        <div className="aspect-square">
          {safeTokens[3] && (
            <CollageImage 
              token={safeTokens[3]}
              src={safeTokens[3].imageUrl?.medium || '/placeholder.svg'}
              alt={safeTokens[3].name || 'Token 4'}
              className={`${selectedToken?.name === safeTokens[3].name ? 'border-2 border-blue-500' : ''}`}
              onClick={() => safeTokens[3] && setSelectedToken(safeTokens[3])}
            />
          )}
        </div>
        
        {/* Middle cell spans 2 columns */}
        <div className="col-span-2 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-blue-500" 
              style={{ fontFamily: 'sans-serif' }}>
            {displayName || 'name'}
          </h1>
        </div>
        
        {/* Bottom row - "Built with MiniKit" on left, horse image spanning 2 cells */}
        <div className="flex flex-col items-start justify-start">
          <p className="text-2xl font-bold text-lime-500 leading-tight" style={{ fontFamily: 'sans-serif' }}>
            BUILT<br />WITH<br />MINIKIT
          </p>
        </div>
        
        <div className="col-span-2 aspect-[2/1]">
          {safeTokens[4] && (
            <CollageImage 
              token={safeTokens[4]}
              src={safeTokens[4].imageUrl?.medium || '/placeholder.svg'}
              alt={safeTokens[4].name || 'Token 5'}
              className={`${selectedToken?.name === safeTokens[4].name ? 'border-2 border-blue-500' : ''}`}
              onClick={() => safeTokens[4] && setSelectedToken(safeTokens[4])}
            />
          )}
        </div>
      </div>
    </div>
  )
}