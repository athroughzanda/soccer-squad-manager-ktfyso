
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getCommonStyles, getColors } from '../styles/commonStyles';
import { FinancialSummary } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface FinancialCardProps {
  title: string;
  financials: FinancialSummary;
}

export default function FinancialCard({ title, financials }: FinancialCardProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const commonStyles = getCommonStyles(isDark);

  const getBalanceColor = (balance: number) => {
    return balance >= 0 ? colors.success : colors.error;
  };

  const getBalanceText = (balance: number) => {
    return balance >= 0 ? 'Surplus' : 'Deficit';
  };

  const styles = getStyles(colors);

  return (
    <View style={commonStyles.card}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.financialGrid}>
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
          <Text style={[styles.financialValue, { color: getBalanceColor(financials.balance) }]}>
            ${Math.abs(financials.balance)}
          </Text>
          <Text style={[styles.balanceStatus, { color: getBalanceColor(financials.balance) }]}>
            {getBalanceText(financials.balance)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  financialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  balanceStatus: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
