package com.messio.nasa;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

/**
 * Created by jpc on 11-09-16.
 */
@Entity
@Table(name = "mission", uniqueConstraints = {@UniqueConstraint(columnNames = {"mission_name"})})
@NamedQueries({
})
public class MissionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Integer id;

    @Column(name = "mission_name")
    private String name;

    @Column(name = "mission_start_date")
    private LocalDate missionStart;

    @Column(name = "mission_end_date")
    private LocalDate missionEnd;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "mission_member", joinColumns = @JoinColumn(name = "mission_fk"), inverseJoinColumns = @JoinColumn(name = "member_fk"))
    private List<CrewMemberEntity> crewMembers;

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

    public LocalDate getMissionStart() {
        return missionStart;
    }

    public void setMissionStart(LocalDate missionStart) {
        this.missionStart = missionStart;
    }

    public LocalDate getMissionEnd() {
        return missionEnd;
    }

    public void setMissionEnd(LocalDate missionEnd) {
        this.missionEnd = missionEnd;
    }

    public List<CrewMemberEntity> getCrewMembers() {
        return crewMembers;
    }

    public void setCrewMembers(List<CrewMemberEntity> crewMembers) {
        this.crewMembers = crewMembers;
    }
}
