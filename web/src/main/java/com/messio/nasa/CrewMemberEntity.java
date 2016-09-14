package com.messio.nasa;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;

/**
 * Created by jpc on 11-09-16.
 */
@Entity
@Table(name = "crew_member", uniqueConstraints = {@UniqueConstraint(columnNames = {"member_name"})})
@NamedQueries({
        @NamedQuery(name = CrewMemberEntity.CREW_MEMBER_BY_NAME, query = "select cm from CrewMemberEntity cm where cm.name = :name"),
        @NamedQuery(name = CrewMemberEntity.CREW_MEMBER_NAMES, query = "select cm.name from CrewMemberEntity cm order by cm.name")
})
public class CrewMemberEntity {
    public static final String CREW_MEMBER_BY_NAME = "crewMember.byName";
    public static final String CREW_MEMBER_NAMES = "crewMember.names";
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Integer id;

    @Column(name = "member_name")
    private String name;

    @ElementCollection
    @CollectionTable(name = "mission_member", joinColumns = @JoinColumn(name = "member_fk"))
    @Column(name = "mission_fk", insertable = false, updatable = false)
    private List<Long> missionIds;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "mission_member", joinColumns = @JoinColumn(name = "member_fk"), inverseJoinColumns = @JoinColumn(name = "mission_fk"))
    @JsonIgnore
    private List<MissionEntity> missions;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Long> getMissionIds() {
        return missionIds;
    }

    public void setMissionIds(List<Long> missionIds) {
        this.missionIds = missionIds;
    }

    public List<MissionEntity> getMissions() {
        return missions;
    }

    public void setMissions(List<MissionEntity> missions) {
        this.missions = missions;
    }
}
