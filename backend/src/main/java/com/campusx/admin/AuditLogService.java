package com.campusx.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(String action, String performedBy, String targetEntity, String entityId, String details, String ipAddress) {
        AuditLog auditLog = AuditLog.builder()
                .action(action)
                .performedBy(performedBy != null ? performedBy : "SYSTEM")
                .targetEntity(targetEntity)
                .entityId(entityId)
                .details(details)
                .ipAddress(ipAddress != null ? ipAddress : "127.0.0.1")
                .build();
        auditLogRepository.save(auditLog);
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop100ByOrderByTimestampDesc();
    }
}
