
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { Team, FinancialSummary } from '../types';
import Icon from './Icon';

interface TeamCardProps {
  team: Team;
  financials: FinancialSummary;
  playerCount: number;
  onPress: () => void;
}

export default function TeamCard({ team, financials, playerCount, onPress }: TeamCardProps) {
  const getStatusColor = (balance: number) => {
    if (balance >= 0) return colors.success;
    return colors.error;
  };

  const getStatusText = (balance: number) => {
    if (balance > 0) return 'Surplus';
    if (balance < 0) return 'Deficit';
    return 'Balanced';
  };

  return (
    <TouchableOpacity style={[commonStyles.card, styles.container]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={commonStyles.textSecondary}>
            {playerCount} players • {team.formation}
          </Text>
        </View>
        <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>
      
      <View style={styles.financialRow}>
        <View style={styles.financialItem}>
          <Text style={styles.financialLabel}>Collected</Text>
          <Text style={[styles.financialAmount, { color: colors.success }]}>
            ${financials.totalCollected}
          </Text>
        </View>
        
        <View style={styles.financialItem}>
          <Text style={styles.financialLabel}>Owed</Text>
          <Text style={[styles.financialAmount, { color: colors.error }]}>
            ${financials.totalOwed}
          </Text>
        </View>
        
        <View style={styles.statusBadge}>
          <View style={[styles.badge, { backgroundColor: getStatusColor(financials.balance) }]}>
            <Text style={styles.badgeText}>
              {getStatusText(financials.balance)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  financialItem: {
    alignItems: 'center',
  },
  financialLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  financialAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    alignItems: 'flex-end',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
});
