package com.messio.nasa;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import javax.annotation.PostConstruct;
import javax.ejb.*;
import javax.inject.Inject;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Logger;

/**
 * Created by jpc on 11-09-16.
 */
@Singleton(name = "nasa/init-singleton")
@LocalBean
@Lock(LockType.READ)
@Startup
public class InitSingleton {
    private static final Logger LOGGER = Logger.getLogger(InitSingleton.class.getCanonicalName());
    @Inject
    private NasaFacadeStateless facade;

    @PostConstruct
    public void init() {
        LOGGER.info("Initializing");
        try {
            final ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.findAndRegisterModules();
            final CrewMemberEntity[] crewMembers = objectMapper.readValue(getClass().getClassLoader().getResourceAsStream("com/messio/nasa/crew_members.json"), CrewMemberEntity[].class);
            LOGGER.info(String.format("Crew member count: %s", crewMembers.length));
            for (CrewMemberEntity crewMember: crewMembers){
                facade.create(crewMember);
            }
            final MissionEntity[] missions = objectMapper.readValue(getClass().getClassLoader().getResourceAsStream("com/messio/nasa/missions.json"), MissionEntity[].class);
            LOGGER.info(String.format("Mission count: %s", missions.length));
            for (MissionEntity mission: missions){
                facade.create(mission);
            }
            final ObjectNode map = objectMapper.readValue(getClass().getClassLoader().getResourceAsStream("com/messio/nasa/memberships.json"), ObjectNode.class);
            for (Iterator<String> it = map.fieldNames(); it.hasNext();){
                final String missionName = it.next();
                final List<CrewMemberEntity> missionCrewMembers = new ArrayList<>();
                final ArrayNode memberNames = (ArrayNode) map.get(missionName);
                for (Iterator<JsonNode> it2 = memberNames.elements(); it2.hasNext();){
                    final String memberName = it2.next().asText();
                    missionCrewMembers.add(facade.findCrewMember(memberName));
                }
                final MissionEntity mission = facade.findMission(missionName);
                mission.setCrewMembers(missionCrewMembers);
                facade.update(mission);
            }

        } catch(IOException e){
            LOGGER.severe(e.getMessage());
        }

    }


}
