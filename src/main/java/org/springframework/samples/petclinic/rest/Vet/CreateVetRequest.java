package org.springframework.samples.petclinic.rest.Vet;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

public class CreateVetRequest {
    @NotNull
    @Size(min=1)
    private String firstName;

    @NotNull
    @Size(min=1)
    private String lastName;

    @NotNull
    private Set<Integer> specialtyIds;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Set<Integer> getSpecialtyIds() {
        return specialtyIds;
    }

    public void setSpecialtyIds(Set<Integer> specialtyIds) {
        this.specialtyIds = specialtyIds;
    }
}
