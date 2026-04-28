-- Migration: migrate_float_to_decimal
-- Change Float to Decimal for all financial fields for precise decimal arithmetic.
-- Float does not have enough precision for financial calculations (e.g. 0.1 + 0.2 !== 0.3).

-- Lease model: financial fields
ALTER TABLE "Lease" ALTER COLUMN "rentAmount" TYPE DECIMAL(12,2) USING "rentAmount"::DECIMAL(12,2);
ALTER TABLE "Lease" ALTER COLUMN "chargesAmount" TYPE DECIMAL(12,2) USING "chargesAmount"::DECIMAL(12,2);
ALTER TABLE "Lease" ALTER COLUMN "depositAmount" TYPE DECIMAL(12,2) USING "depositAmount"::DECIMAL(12,2);
ALTER TABLE "Lease" ALTER COLUMN "irlReferenceValue" TYPE DECIMAL(10,5) USING "irlReferenceValue"::DECIMAL(10,5);

-- Transaction model: financial fields
ALTER TABLE "Transaction" ALTER COLUMN "amount" TYPE DECIMAL(12,2) USING "amount"::DECIMAL(12,2);
ALTER TABLE "Transaction" ALTER COLUMN "rentPortion" TYPE DECIMAL(12,2) USING "rentPortion"::DECIMAL(12,2);
ALTER TABLE "Transaction" ALTER COLUMN "chargesPortion" TYPE DECIMAL(12,2) USING "chargesPortion"::DECIMAL(12,2);

-- IrlIndex: IRL value
ALTER TABLE "IrlIndex" ALTER COLUMN "value" TYPE DECIMAL(10,5) USING "value"::DECIMAL(10,5);

-- Expense: amount
ALTER TABLE "Expense" ALTER COLUMN "amount" TYPE DECIMAL(12,2) USING "amount"::DECIMAL(12,2);
