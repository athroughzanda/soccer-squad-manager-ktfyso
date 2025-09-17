
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Team, FinancialSummary } from '../types';
import { getCommonStyles, getColors } from '../styles/commonStyles';
import { useTheme } from '../contexts/ThemeContext';
import Icon from './Icon';

interface TeamCardProps {
  team: Team;
  financials: FinancialSummary;
  playerCount: number;
  onPress: () => void;
}

export default function TeamCard({ team, financials, playerCount, onPress }: TeamCardProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const commonStyles = getCommonStyles(isDark);

  const getStatusColor = (balance: number) => {
    return balance >= 0 ? colors.success : colors.error;
  };

  const getStatusText = (balance: number) => {
    return balance >= 0 ? 'Surplus' : 'Deficit';
  };

  const styles = getStyles(colors);

  return (
    <TouchableOpacity style={commonStyles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={commonStyles.textSecondary}>
            {playerCount} players • {team.formation}
          </Text>
        </View>
        <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>

      <View style={styles.financialSummary}>
        <View style={styles.financialItem}>
          <Text style={styles.financialLabel}>Collected</Text>
          <Text style={[styles.financialValue, { color: colors.success }]}>
            ${financials.totalCollected}
          </Text>
        </View>
        
        <View style={styles.financialItem}>
          <Text style={styles.financialLabel}>Owed</Text>
          <Text style={[styles.financialValue, { color: colors.error }]}>
            ${financials.totalOwed}
          </Text>
        </View>
        
        <View style={styles.financialItem}>
          <Text style={styles.financialLabel}>Balance</Text>
          <Text style={[styles.financialValue, { color: getStatusColor(financials.balance) }]}>
            ${Math.abs(financials.balance)}
          </Text>
        </View>
      </View>

      <View style={styles.statusBar}>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: getStatusColor(financials.balance) }
        ]}>
          <Text style={styles.statusText}>
            {getStatusText(financials.balance)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  financialSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  financialItem: {
    flex: 1,
    alignItems: 'center',
  },
  financialLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  financialValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusBar: {
    alignItems: 'center',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
    textTransform: 'uppercase',
  },
});
