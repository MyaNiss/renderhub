package app.back.code.user.repository;

import app.back.code.user.entity.UserAccountEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserAccountEntity, String>, JpaSpecificationExecutor<UserAccountEntity> {

    Optional<UserAccountEntity> findByUserId(String userId);

    boolean existsByEmail(String email);
    boolean existsByUserId(String userId);

    @EntityGraph(attributePaths = {"role"})
    Page<UserAccountEntity> findAll(Pageable pageable);


    @EntityGraph(attributePaths = {"role"})
    Page<UserAccountEntity> findAll(Specification<UserAccountEntity> userSearchSpecification, Pageable pageable);

}
