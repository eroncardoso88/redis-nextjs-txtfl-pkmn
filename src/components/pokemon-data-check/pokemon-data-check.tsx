'use client';

import { FolderSyncIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import './pokemon-data-check.scss';

interface SyncPokemonButtonProps {
  onSync?: () => void;
}

function SyncPokemonButton({ onSync }: SyncPokemonButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      const response = await fetch('/api/pokemon/sync', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        if (onSync) onSync();
      }
    } catch (error) {
      console.error('Error syncing Pokemon data:', error);
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <button 
      onClick={handleSync}
      className="pokemon-check__sync-button"
      disabled={isSyncing}
    >
      <FolderSyncIcon className={`pokemon-check__sync-icon ${isSyncing ? 'pokemon-check__sync-icon--spinning' : ''}`} />
      {isSyncing ? 'Syncing...' : 'Sync Pokemon Data'}
    </button>
  );
}

export default function PokemonDataCheck() {
  const [needsData, setNeedsData] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    async function checkData() {
      try {
        const response = await fetch('/api/pokemon/check');
        const data = await response.json();
        console.log(`data `, data)
        setNeedsData(!data.hasData);
      } catch (error) {
        console.error('Error checking Pokemon data:', error);
      } finally {
        setIsChecking(false);
      }
    }
    checkData();
  }, []);
  
  const handleSyncComplete = () => {
    setNeedsData(false);
  };
  
  if (isChecking) {
    return null; 
  }
  
  if (!needsData) {
    return null; 
  }
  
  return (
    <div className="pokemon-check__wrapper">
      <div className="pokemon-check__container">
        <h3 className="pokemon-check__title">Pokemon Data Missing</h3>
        
        
        <p className="pokemon-check__text">
          Your database doesn't have any Pokemon data. Run the following click the button:
        </p>

        <SyncPokemonButton onSync={handleSyncComplete} />

        <p className="pokemon-check__text pokemon-check__text--small">
          Or run the command:
        </p>

        
        <div className="pokemon-check__code-block">
          npm run docker:init
        </div>
        
        <p className="pokemon-check__text pokemon-check__text--small">
          Or if you want a fresh start:
        </p>
        
        <div className="pokemon-check__code-block">
          npm run docker:fresh_dev
        </div>
      </div>
    </div>
  );
}