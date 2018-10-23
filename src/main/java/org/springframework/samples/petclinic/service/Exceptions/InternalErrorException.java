package org.springframework.samples.petclinic.service.Exceptions;

public class InternalErrorException extends RuntimeException {
   public InternalErrorException(String message)  {
       super(message);
   }
}
