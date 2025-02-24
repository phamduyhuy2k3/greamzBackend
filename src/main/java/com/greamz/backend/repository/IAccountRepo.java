package com.greamz.backend.repository;


import com.greamz.backend.enumeration.AuthProvider;
import com.greamz.backend.model.AccountModel;
import com.greamz.backend.model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IAccountRepo extends JpaRepository<AccountModel, Integer> {
    @Modifying
    @Query("UPDATE AccountModel u SET u.isEnabled = :enabled WHERE u.id = :userId")
    void updateEnabled(@Param("userId") Integer userId, @Param("enabled") boolean enabled);

    @Query("select a from AccountModel  a where a.username=?1 or a.email=?1")
    Optional<AccountModel> findByUserNameOrEmail(String username);

    Optional<AccountModel> findByUsername(String username);
    @Query("select a.vouchers from AccountModel a where a.id=?1")
    List<Voucher> findVoucherById(Integer id);

    Boolean existsByEmail(String email);

    Boolean existsByUsername(String username);
}
