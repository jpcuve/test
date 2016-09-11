package com.messio.nasa;

import javax.persistence.*;
import java.util.List;

/**
 * Created by jpc on 11-09-16.
 */
@Entity
@Table(name = "crew_member", uniqueConstraints = {@UniqueConstraint(columnNames = {"member_name"})})
@NamedQueries({
})
public class CrewMemberEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Integer id;

    @Column(name = "member_name")
    private String name;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "mission_member", joinColumns = @JoinColumn(name = "member_fk"), inverseJoinColumns = @JoinColumn(name = "mission_fk"))
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

    public List<MissionEntity> getMissions() {
        return missions;
    }

    public void setMissions(List<MissionEntity> missions) {
        this.missions = missions;
    }
}
