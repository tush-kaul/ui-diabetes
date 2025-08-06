-- CreateTable
CREATE TABLE "public"."Patients" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "ipd" TEXT NOT NULL,
    "opd" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HbA1cEntry" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "labName" TEXT NOT NULL,
    "notes" TEXT,
    "zone" TEXT NOT NULL,
    "alertLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HbA1cEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patients_phoneNumber_key" ON "public"."Patients"("phoneNumber");

-- AddForeignKey
ALTER TABLE "public"."HbA1cEntry" ADD CONSTRAINT "HbA1cEntry_phoneNumber_fkey" FOREIGN KEY ("phoneNumber") REFERENCES "public"."Patients"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
