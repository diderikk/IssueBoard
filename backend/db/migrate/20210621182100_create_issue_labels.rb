class CreateIssueLabels < ActiveRecord::Migration[6.1]
  def change
    create_table :issue_labels do |t|
      t.string :name, null: false
      t.string :color, null: true
      t.integer :order, null: false
      t.belongs_to :issue_board, null: false, foreign_key: "issue_board_id"

      t.timestamps
    end
    add_index :issue_labels, [:name, :issue_board_id], unique: true
  end
end
