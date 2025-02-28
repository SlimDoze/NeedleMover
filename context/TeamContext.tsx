// File: /context/TeamContext.tsx
import React, { createContext, useState, useContext } from 'react';

// Define types for teams and spaces
interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

interface Space {
  id: string;
  name: string;
  type: 'Single Release' | 'Multi Track Release';
  trackCount: number;
}

// Define the type for the context
interface TeamContextType {
  teams: Team[];
  spaces: Record<string, Space[]>;
  createTeam: (name: string, description: string) => Promise<Team>;
  joinTeam: (inviteCode: string) => Promise<Team>;
  createSpace: (teamId: string, name: string, type: 'Single Release' | 'Multi Track Release') => Promise<Space>;
}

// Create the context with a default value
const TeamContext = createContext<TeamContextType>({
  teams: [],
  spaces: {},
  createTeam: async () => ({ id: '', name: '', description: '', memberCount: 0 }),
  joinTeam: async () => ({ id: '', name: '', description: '', memberCount: 0 }),
  createSpace: async () => ({ id: '', name: '', type: 'Single Release', trackCount: 0 }),
});

// Mock data for teams
const mockTeams: Team[] = [
  { id: '1', name: 'Beats Collective', description: 'Hip hop production team', memberCount: 5 },
  { id: '2', name: 'Studio 42', description: 'Rock band and production', memberCount: 4 },
  { id: '3', name: 'Electronic Vibes', description: 'EDM production team', memberCount: 3 },
];

// Mock data for spaces
const mockSpaces: Record<string, Space[]> = {
  '1': [
    { id: '1', name: 'Summer EP', type: 'Multi Track Release', trackCount: 4 },
    { id: '2', name: 'Winter Single', type: 'Single Release', trackCount: 1 },
  ],
  '2': [
    { id: '3', name: 'Debut Album', type: 'Multi Track Release', trackCount: 10 },
  ],
  '3': [
    { id: '4', name: 'Collaboration X', type: 'Single Release', trackCount: 1 },
  ],
};

// Create a provider component
export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [spaces, setSpaces] = useState<Record<string, Space[]>>(mockSpaces);

  // Function to create a new team
  const createTeam = async (name: string, description: string): Promise<Team> => {
    // In a real app, you would make an API call to create the team
    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      description,
      memberCount: 1,
    };
    
    setTeams([...teams, newTeam]);
    setSpaces({ ...spaces, [newTeam.id]: [] });
    
    return newTeam;
  };

  // Function to join a team using an invite code
  const joinTeam = async (inviteCode: string): Promise<Team> => {
    // In a real app, you would make an API call to validate the invite code and join the team
    // For demo purposes, let's assume the invite code is valid for the first team
    const team = teams[0];
    
    // Update the member count
    const updatedTeams = teams.map(t => 
      t.id === team.id ? { ...t, memberCount: t.memberCount + 1 } : t
    );
    
    setTeams(updatedTeams);
    return team;
  };

  // Function to create a new space within a team
  const createSpace = async (
    teamId: string, 
    name: string, 
    type: 'Single Release' | 'Multi Track Release'
  ): Promise<Space> => {
    // In a real app, you would make an API call to create the space
    const newSpace: Space = {
      id: Date.now().toString(),
      name,
      type,
      trackCount: 0,
    };
    
    const teamSpaces = spaces[teamId] || [];
    setSpaces({
      ...spaces,
      [teamId]: [...teamSpaces, newSpace],
    });
    
    return newSpace;
  };

  return (
    <TeamContext.Provider value={{ teams, spaces, createTeam, joinTeam, createSpace }}>
      {children}
    </TeamContext.Provider>
  );
}

// Custom hook to use the team context
export const useTeam = () => useContext(TeamContext);