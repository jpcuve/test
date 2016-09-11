package com.messio.nasa;

import org.codehaus.jackson.map.ObjectMapper;

import javax.annotation.PostConstruct;
import javax.ejb.*;
import javax.inject.Inject;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.logging.Logger;

/**
 * Created by jpc on 11-09-16.
 */
@Singleton
@Lock(LockType.READ)
@LocalBean
@Stateless
public class InitSingleton {
    private static final Logger LOGGER = Logger.getLogger(InitSingleton.class.getCanonicalName());
    @Inject
    private NasaFacadeStateless facade;

    @PostConstruct
    public void init() throws IOException {
        LOGGER.info("Initializing");
        final ObjectMapper objectMapper = new ObjectMapper();
        final InputStream is = getClass().getClassLoader().getResourceAsStream("com/messio/nasa/crew_members.json");
        final List<String> crewMemberNames = objectMapper.readValue(is, List.class);
        LOGGER.info(String.format("Crew member name count: %s", crewMemberNames.size()));


    }


}
