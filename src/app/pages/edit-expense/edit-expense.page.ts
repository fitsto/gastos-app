import { Component, OnInit, Inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Expense } from '../../contexts/expenses/domain/expense.entity';
import { ExpenseRepository, IExpenseRepository } from '../../contexts/expenses/domain/expense.repository';
import { UpdateExpenseUseCase } from '../../contexts/expenses/application/update-expense.use-case';

@Component({
  selector: 'app-edit-expense',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-expense.page.html',
  styleUrls: ['./edit-expense.page.scss']
})
export class EditExpensePage implements OnInit {
  expenseForm: FormGroup;
  expenseId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(ExpenseRepository) private expenseRepository: IExpenseRepository,
    @Inject(UpdateExpenseUseCase) private updateExpenseUseCase: UpdateExpenseUseCase
  ) {
    this.expenseForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      date: [new Date().toISOString(), Validators.required],
      description: ['']
    });
  }

  async ngOnInit() {
    this.expenseId = this.route.snapshot.paramMap.get('id') || '';
    if (this.expenseId) {
      const expense = await this.expenseRepository.findById(this.expenseId);
      if (expense) {
        this.expenseForm.patchValue({
          amount: expense.amount,
          categoryId: expense.categoryId,
          date: expense.date.toISOString(),
          description: expense.description
        });
      }
    }
  }

  async onSubmit() {
    if (this.expenseForm.valid && this.expenseId) {
      try {
        const { amount, categoryId, date, description } = this.expenseForm.value;
        await this.updateExpenseUseCase.execute(this.expenseId, {
          amount,
          categoryId,
          date,
          description
        });
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al actualizar el gasto:', error);
        // TODO: Mostrar mensaje de error al usuario
      }
    }
  }
}
