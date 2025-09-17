
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { useTeamData } from '../../hooks/useTeamData';
import FinancialCard from '../../components/FinancialCard';
import PlayerCard from '../../components/PlayerCard';
import Icon from '../../components/Icon';
import SimpleBottomSheet from '../../components/BottomSheet';
import AddPlayerForm from '../../components/AddPlayerForm';

type ViewMode = 'detailed' | 'roster' | 'gameday';

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { teams, getTeamPlayers, getTeamFinancials, updateTeamDebt, addPlayer } = useTeamData();
  const [viewMode, setViewMode] = useState<ViewMode>('detailed');
  const [showPlayerDetails, setShowPlayerDetails] = useState(false);
  const [editingDebt, setEditingDebt] = useState(false);
  const [tempDebt, setTempDebt] = useState('');
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  const team = teams.find(t => t.id === id);
  const teamPlayers = getTeamPlayers(id!);
  const teamFinancials = getTeamFinancials(id!);

  if (!team) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, commonStyles.centerContent]}>
          <Text style={commonStyles.text}>Team not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDebtEdit = () => {
    setTempDebt(team.totalOwed.toString());
    setEditingDebt(true);
  };

  const handleDebtSave = () => {
    const amount = parseFloat(tempDebt) || 0;
    if (amount < 0) {
      Alert.alert('Error', 'Debt amount cannot be negative');
      return;
    }
    updateTeamDebt(team.id, amount);
    setEditingDebt(false);
  };

  const handleAddPlayer = (player: any) => {
    const playerWithTeam = {
      ...player,
      teamIds: [...(player.teamIds || []), team.id],
    };
    addPlayer(playerWithTeam);
    setShowAddPlayer(false);
  };

  const renderDetailedView = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.financialSection}>
        <Text style={commonStyles.subtitle}>Team Finances</Text>
        <View style={commonStyles.card}>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Total Collected:</Text>
            <Text style={[styles.financialValue, { color: colors.success }]}>
              ${teamFinancials.totalCollected}
            </Text>
          </View>
          
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Money Owed:</Text>
            {editingDebt ? (
              <View style={styles.debtEditContainer}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  style={styles.debtInput}
                  value={tempDebt}
                  onChangeText={setTempDebt}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleDebtSave}
                >
                  <Icon name="checkmark" size={16} color={colors.background} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditingDebt(false)}
                >
                  <Icon name="close" size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.editableDebt}
                onPress={handleDebtEdit}
              >
                <Text style={[styles.financialValue, { color: colors.error }]}>
                  ${team.totalOwed}
                </Text>
                <Icon name="pencil" size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={[styles.financialRow, styles.balanceRow]}>
            <Text style={[styles.financialLabel, styles.balanceLabel]}>Balance:</Text>
            <Text style={[
              styles.financialValue, 
              styles.balanceValue,
              { color: teamFinancials.balance >= 0 ? colors.success : colors.error }
            ]}>
              ${teamFinancials.balance}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={commonStyles.subtitle}>Players ({teamPlayers.length})</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowPlayerDetails(!showPlayerDetails)}
            >
              <Text style={styles.toggleText}>
                {showPlayerDetails ? 'Hide Details' : 'Show Details'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addPlayerButton}
              onPress={() => setShowAddPlayer(true)}
            >
              <Icon name="add" size={16} color={colors.background} />
            </TouchableOpacity>
          </View>
        </View>

        {teamPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            showDetails={showPlayerDetails}
            allowEditing={showPlayerDetails}
          />
        ))}

        {teamPlayers.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="people" size={48} color={colors.textSecondary} />
            <Text style={[commonStyles.text, styles.emptyText]}>
              No players in this team yet
            </Text>
            <TouchableOpacity
              style={[buttonStyles.primary, styles.addFirstPlayerButton]}
              onPress={() => setShowAddPlayer(true)}
            >
              <Text style={[commonStyles.text, { color: colors.background }]}>
                Add First Player
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={commonStyles.subtitle}>Team Information</Text>
        <View style={commonStyles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Formation:</Text>
            <Text style={styles.infoValue}>{team.formation}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>
              {team.createdAt.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderRosterView = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={commonStyles.subtitle}>Team Roster</Text>
        
        {['Goalkeeper', 'Defender', 'Midfielder', 'Forward'].map((position) => {
          const positionPlayers = teamPlayers.filter(p => p.position === position);
          
          return (
            <View key={position} style={styles.positionSection}>
              <Text style={styles.positionTitle}>
                {position}s ({positionPlayers.length})
              </Text>
              
              {positionPlayers.map((player) => (
                <View key={player.id} style={styles.rosterCard}>
                  <View style={styles.rosterInfo}>
                    <Text style={styles.rosterName}>{player.name}</Text>
                    <Text style={commonStyles.textSecondary}>
                      {player.eligibility} • {player.isAvailable ? 'Available' : 'Unavailable'}
                    </Text>
                  </View>
                  
                  <View style={styles.rosterBadges}>
                    <View style={[
                      styles.badge,
                      { backgroundColor: player.isAvailable ? colors.success : colors.error }
                    ]}>
                      <Text style={styles.badgeText}>
                        {player.isAvailable ? 'Available' : 'Unavailable'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
              
              {positionPlayers.length === 0 && (
                <Text style={[commonStyles.textSecondary, styles.noPlayers]}>
                  No {position.toLowerCase()}s assigned
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderGameDayView = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={commonStyles.subtitle}>Game Day Setup</Text>
        
        <View style={commonStyles.card}>
          <Text style={styles.formationTitle}>Formation: {team.formation}</Text>
          
          <View style={styles.fieldContainer}>
            <View style={styles.field}>
              <Text style={styles.fieldText}>Soccer Field</Text>
              <Text style={commonStyles.textSecondary}>
                Drag & drop functionality coming soon!
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Players</Text>
          
          {teamPlayers
            .filter(p => p.isAvailable && p.eligibility === 'Eligible')
            .map((player) => (
              <View key={player.id} style={styles.availablePlayerCard}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={commonStyles.textSecondary}>{player.position}</Text>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (viewMode) {
      case 'detailed':
        return renderDetailedView();
      case 'roster':
        return renderRosterView();
      case 'gameday':
        return renderGameDayView();
      default:
        return renderDetailedView();
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, styles.teamTitle]}>{team.name}</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push('/payment-methods')}
          >
            <Icon name="settings" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          {[
            { key: 'detailed', label: 'Details', icon: 'information-circle' },
            { key: 'roster', label: 'Roster', icon: 'people' },
            { key: 'gameday', label: 'Game Day', icon: 'football' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                viewMode === tab.key && styles.activeTab
              ]}
              onPress={() => setViewMode(tab.key as ViewMode)}
            >
              <Icon
                name={tab.icon as any}
                size={20}
                color={viewMode === tab.key ? colors.primary : colors.textSecondary}
              />
              <Text style={[
                styles.tabText,
                viewMode === tab.key && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderContent()}
      </View>

      <SimpleBottomSheet
        isVisible={showAddPlayer}
        onClose={() => setShowAddPlayer(false)}
      >
        <AddPlayerForm
          onAddPlayer={handleAddPlayer}
          onCancel={() => setShowAddPlayer(false)}
          teamId={team.id}
        />
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: colors.background,
    boxShadow: `0px 1px 3px ${colors.shadow}`,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  financialSection: {
    marginBottom: 24,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 0,
  },
  financialLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  financialValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  editableDebt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: colors.backgroundAlt,
  },
  debtEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dollarSign: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  debtInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.background,
    minWidth: 80,
  },
  saveButton: {
    backgroundColor: colors.success,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.backgroundAlt,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  addPlayerButton: {
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  addFirstPlayerButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  positionSection: {
    marginBottom: 20,
  },
  positionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  rosterCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rosterInfo: {
    flex: 1,
  },
  rosterName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  rosterBadges: {
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
  noPlayers: {
    fontStyle: 'italic',
    marginLeft: 12,
  },
  formationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  fieldContainer: {
    alignItems: 'center',
  },
  field: {
    width: '100%',
    height: 200,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  fieldText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.background,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  availablePlayerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
