/*
 * Copyright 2002-2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.springframework.samples.petclinic.vet;

import java.util.Collection;
import java.util.Set;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

/**
 * Repository class for <code>Vet</code> domain objects All method names are compliant with Spring Data naming
 * conventions so this interface can easily be extended for Spring Data See here: http://static.springsource.org/spring-data/jpa/docs/current/reference/html/jpa.repositories.html#jpa.query-methods.query-creation
 *
 * @author Ken Krebs
 * @author Juergen Hoeller
 * @author Sam Brannen
 * @author Michael Isvy
 */
public interface VetRepository extends Repository<Vet, Integer> {

    /**
     * Retrieve all <code>Vet</code>s from the data store.
     *
     * @return a <code>Collection</code> of <code>Vet</code>s
     */
    @Transactional(readOnly = true)
    @Query("SELECT sp FROM Specialty sp WHERE sp.id = :id")
    Specialty findSpeciality(@Param("id") Integer specialityId);

    @Transactional(readOnly = true)
    @Query("SELECT sp FROM Specialty sp WHERE lower(sp.name) LIKE lower(concat(:name, '%')) ORDER BY sp.name")
    Collection<Specialty> findSpecialities(@Param("name") String name);

    @Transactional(readOnly = true)
    @Query(value = "SELECT sp FROM Specialty sp WHERE sp.id IN :ids")
    Collection<Specialty> findSpecialities(@Param("ids") Set<Integer> ids);

    @Transactional(readOnly = true)
    @Cacheable("vets")
    Collection<Vet> findAll() throws DataAccessException;

    @Transactional(readOnly = true)
    @Query("SELECT vet FROM Vet vet WHERE lower(vet.lastName) LIKE lower(concat(:lastName, '%')) ORDER BY vet.lastName ASC")
    Collection<Vet> findByLastName(@Param("lastName") String lastName);

    @Transactional(readOnly = true)
    Vet findById(Integer id);

    Vet save(Vet vet);
}
