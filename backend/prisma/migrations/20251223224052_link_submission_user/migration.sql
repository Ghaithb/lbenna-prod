-- AddForeignKey
ALTER TABLE "workshop_submissions" ADD CONSTRAINT "workshop_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
