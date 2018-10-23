package org.springframework.samples.petclinic.service;

import org.springframework.samples.petclinic.service.Exceptions.BadRequestException;
import org.springframework.samples.petclinic.service.Exceptions.EntityNotFoundException;
import org.springframework.samples.petclinic.vet.Specialty;
import org.springframework.samples.petclinic.vet.Vet;
import org.springframework.samples.petclinic.vet.VetRepository;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.Collection;
import java.util.Set;

@Service
public class VetService {
    private final VetRepository vetRepository;

    VetService(VetRepository vetRepository) {
        this.vetRepository = vetRepository;
    }

    public Vet findById(Integer vetId) {
        Vet vet = vetRepository.findById(vetId);
        if(vet == null) {
            throw new EntityNotFoundException("Vet with id " + vetId + " not found");
        }
        return vet;
    }

    public Collection<Vet> findByLastLame(String lastName) {
        return vetRepository.findByLastName(lastName);
    }

    public Collection<Specialty> findVetSpecialities(String specialityName) {
        return vetRepository.findSpecialities(specialityName);
    }

    public Specialty findVetSpecialityById(Integer specialityId) {
        Specialty speciality = vetRepository.findSpeciality(specialityId);
        if (speciality == null) {
            throw new EntityNotFoundException("Speciality with id " + specialityId + " not found");
        }
        return speciality;
    }

    public Vet createNewVet(String firstName, String lastName, Set<Integer> specialityIds) {
        Vet vet = new Vet();
        vet.setFirstName(firstName);
        vet.setLastName(lastName);
        if(specialityIds.size() > 0) {
            Collection<Specialty> specialities = vetRepository.findSpecialities(specialityIds);
            specialities.forEach(vet::addSpecialty);
        }
        try {
            return vetRepository.save(vet);
        }
        catch (ConstraintViolationException ex) {
            throw new BadRequestException("One or more specialityIds do not exist");
        }
    }
}
