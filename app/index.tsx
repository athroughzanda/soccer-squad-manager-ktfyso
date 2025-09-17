
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCommonStyles, getColors, getButtonStyles } from '../styles/commonStyles';
import { useTeamData } from '../hooks/useTeamData';
import FinancialCard from '../components/FinancialCard';
import TeamCard from '../components/TeamCard';
import CenterModal from '../components/CenterModal';
import AddPlayerForm from '../components/AddPlayerForm';
import Icon from '../components/Icon';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function AllTeamsView() {
  const router = useRouter();
  const { theme, toggleTheme, isDark } = useTheme();
  const colors = getColors(isDark);
  const commonStyles = getCommonStyles(isDark);
  const buttonStyles = getButtonStyles(isDark);
  
  const { teams, players, addPlayer, getTeamPlayers, getTeamFinancials, getAllTeamsFinancials } = useTeamData();
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  const overallFinancials = getAllTeamsFinancials();

  const handleTeamPress = (teamId: string) => {
    router.push(`/team/${teamId}`);
  };

  const handleAddPlayer = (player: any) => {
    addPlayer(player);
    setShowAddPlayer(false);
    console.log('Player added successfully');
  };

  const styles = getStyles(colors);

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Soccer Teams</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.themeButton}
              onPress={toggleTheme}
            >
              <Icon 
                name={isDark ? "sunny" : "moon"} 
                size={24} 
                color={colors.text} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('/payment-methods')}
            >
              <Icon name="settings" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddPlayer(true)}
            >
              <Icon name="add" size={24} color={colors.background} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <FinancialCard
            title="Overall Financial Summary"
            financials={overallFinancials}
          />

          <View style={styles.section}>
            <Text style={commonStyles.subtitle}>Teams ({teams.length})</Text>
            
            {teams.map((team) => {
              const teamPlayers = getTeamPlayers(team.id);
              const teamFinancials = getTeamFinancials(team.id);
              
              return (
                <TeamCard
                  key={team.id}
                  team={team}
                  financials={teamFinancials}
                  playerCount={teamPlayers.length}
                  onPress={() => handleTeamPress(team.id)}
                />
              );
            })}
            
            {teams.length === 0 && (
              <View style={styles.emptyState}>
                <Icon name="football" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, styles.emptyText]}>
                  No teams yet. Create your first team!
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={commonStyles.subtitle}>Quick Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{players.length}</Text>
                <Text style={styles.statLabel}>Total Players</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{teams.length}</Text>
                <Text style={styles.statLabel}>Active Teams</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: colors.success }]}>
                  ${overallFinancials.totalCollected}
                </Text>
                <Text style={styles.statLabel}>Total Collected</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={commonStyles.subtitle}>Quick Actions</Text>
            </View>
            <View style={styles.actionGrid}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => setShowAddPlayer(true)}
              >
                <Icon name="person-add" size={32} color={colors.primary} />
                <Text style={styles.actionTitle}>Add Player</Text>
                <Text style={styles.actionSubtitle}>Add a new player to any team</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/payment-methods')}
              >
                <Icon name="card" size={32} color={colors.primary} />
                <Text style={styles.actionTitle}>Payment Methods</Text>
                <Text style={styles.actionSubtitle}>Manage payment options</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      <CenterModal
        isVisible={showAddPlayer}
        onClose={() => setShowAddPlayer(false)}
      >
        <AddPlayerForm
          onAddPlayer={handleAddPlayer}
          onCancel={() => setShowAddPlayer(false)}
        />
      </CenterModal>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
