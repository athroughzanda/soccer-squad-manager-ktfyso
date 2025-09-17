
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { FinancialSummary } from '../types';

interface FinancialCardProps {
  title: string;
  financials: FinancialSummary;
}

export default function FinancialCard({ title, financials }: FinancialCardProps) {
  const getBalanceColor = (balance: number) => {
    if (balance > 0) return colors.success;
    if (balance < 0) return colors.error;
    return colors.textSecondary;
  };

  const getBalanceText = (balance: number) => {
    if (balance > 0) return `+$${balance}`;
    if (balance < 0) return `-$${Math.abs(balance)}`;
    return '$0';
  };

  return (
    <View style={[commonStyles.card, styles.container]}>
      <Text style={[commonStyles.subtitle, styles.title]}>{title}</Text>
      
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Collected</Text>
          <Text style={[styles.amount, { color: colors.success }]}>
            ${financials.totalCollected}
          </Text>
        </View>
        
        <View style={styles.column}>
          <Text style={styles.label}>Owed</Text>
          <Text style={[styles.amount, { color: colors.error }]}>
            ${financials.totalOwed}
          </Text>
        </View>
        
        <View style={styles.column}>
          <Text style={styles.label}>Balance</Text>
          <Text style={[styles.amount, { color: getBalanceColor(financials.balance) }]}>
            {getBalanceText(financials.balance)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  column: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
  },
});
