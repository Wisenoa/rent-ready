-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease"("id") ON DELETE CASCADE ON UPDATE CASCADE;
