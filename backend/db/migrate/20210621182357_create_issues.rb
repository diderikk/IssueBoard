class CreateIssues < ActiveRecord::Migration[6.1]
  def change
    create_table :issues do |t|
      t.integer :issue_id, null: false
      t.string :title, null: false
      t.string :description, null: true
      t.datetime :due_date, null: true
      t.belongs_to :issue_label, null: false, foreign_key: "issue_label_id"

      t.timestamps
    end
    add_index :issues, [:issue_id, :issue_label_id], unique: true
  end
end
