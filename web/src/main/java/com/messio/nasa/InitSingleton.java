package com.messio.nasa;


import com.fasterxml.jackson.databind.ObjectMapper;

import javax.annotation.PostConstruct;
import javax.ejb.*;
import javax.inject.Inject;
import java.io.IOException;
import java.io.InputStream;
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
            final InputStream is = getClass().getClassLoader().getResourceAsStream("com/messio/nasa/crew_members.json");
            final CrewMemberEntity[] crewMembers = objectMapper.readValue(is, CrewMemberEntity[].class);
            LOGGER.info(String.format("Crew member count: %s", crewMembers.length));
            for (CrewMemberEntity crewMember: crewMembers){
                facade.create(crewMember);
            }
        } catch(IOException e){
            LOGGER.throwing(null, null, e);
        }

    }


}
