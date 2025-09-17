
import { useState, useEffect } from 'react';
import { Player, Team, FinancialSummary, PaymentMethodConfig, PaymentMethod, EligibilityStatus } from '../types';
import { mockPlayers, mockTeams } from '../data/mockData';

const defaultPaymentMethods: PaymentMethodConfig[] = [
  { id: '1', name: 'Cash', isDefault: true },
  { id: '2', name: 'Card', isDefault: true },
  { id: '3', name: 'Transfer', isDefault: true },
  { id: '4', name: 'Venmo', isDefault: false },
  { id: '5', name: 'Check', isDefault: false },
];

export const useTeamData = () => {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(defaultPaymentMethods);

  const addPlayer = (player: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...player,
      id: Date.now().toString(),
    };
    setPlayers(prev => [...prev, newPlayer]);
    console.log('Added new player:', newPlayer.name);
  };

  const addTeam = (team: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam: Team = {
      ...team,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTeams(prev => [...prev, newTeam]);
    console.log('Added new team:', newTeam.name);
  };

  const getTeamPlayers = (teamId: string): Player[] => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return [];
    return players.filter(p => p.teamIds.includes(teamId));
  };

  const getTeamFinancials = (teamId: string): FinancialSummary => {
    const teamPlayers = getTeamPlayers(teamId);
    const totalCollected = teamPlayers.reduce((sum, player) => sum + player.amountPaid, 0);
    const team = teams.find(t => t.id === teamId);
    const totalOwed = team?.totalOwed || 0;
    
    return {
      totalCollected,
      totalOwed,
      balance: totalCollected - totalOwed,
    };
  };

  const getAllTeamsFinancials = (): FinancialSummary => {
    const totalCollected = players.reduce((sum, player) => sum + player.amountPaid, 0);
    const totalOwed = teams.reduce((sum, team) => sum + team.totalOwed, 0);
    
    return {
      totalCollected,
      totalOwed,
      balance: totalCollected - totalOwed,
    };
  };

  const updatePlayerPayment = (playerId: string, amount: number, method: PaymentMethod) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, amountPaid: amount, paymentMethod: method }
        : player
    ));
    console.log('Updated player payment:', playerId, amount, method);
  };

  const updatePlayerEligibility = (playerId: string, eligibility: EligibilityStatus) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, eligibility }
        : player
    ));
    console.log('Updated player eligibility:', playerId, eligibility);
  };

  const updateTeamDebt = (teamId: string, totalOwed: number) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, totalOwed }
        : team
    ));
    console.log('Updated team debt:', teamId, totalOwed);
  };

  const addPaymentMethod = (name: string) => {
    const newMethod: PaymentMethodConfig = {
      id: Date.now().toString(),
      name,
      isDefault: false,
    };
    setPaymentMethods(prev => [...prev, newMethod]);
    console.log('Added payment method:', name);
  };

  const updatePaymentMethod = (id: string, name: string) => {
    setPaymentMethods(prev => prev.map(method => 
      method.id === id 
        ? { ...method, name }
        : method
    ));
    console.log('Updated payment method:', id, name);
  };

  const deletePaymentMethod = (id: string) => {
    const method = paymentMethods.find(m => m.id === id);
    if (method?.isDefault) {
      console.log('Cannot delete default payment method');
      return false;
    }
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
    console.log('Deleted payment method:', id);
    return true;
  };

  return {
    players,
    teams,
    paymentMethods,
    addPlayer,
    addTeam,
    getTeamPlayers,
    getTeamFinancials,
    getAllTeamsFinancials,
    updatePlayerPayment,
    updatePlayerEligibility,
    updateTeamDebt,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
  };
};
