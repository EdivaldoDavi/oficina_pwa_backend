-- DropForeignKey
ALTER TABLE `ServicoOrcamento` DROP FOREIGN KEY `ServicoOrcamento_servicoId_fkey`;

-- DropIndex
DROP INDEX `ServicoOrcamento_servicoId_fkey` ON `ServicoOrcamento`;

-- AlterTable
ALTER TABLE `ServicoOrcamento` MODIFY `servicoId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ServicoOrcamento` ADD CONSTRAINT `ServicoOrcamento_servicoId_fkey` FOREIGN KEY (`servicoId`) REFERENCES `Servico`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
